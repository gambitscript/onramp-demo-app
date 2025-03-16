"use client";
import { Button, Card, Link, Select, SelectItem } from "@nextui-org/react";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { generateSellConfig } from "../utils/queries";
import { SellConfigResponse } from "../utils/types";
import dynamic from "next/dynamic";
const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });
const JsonViewer = ReactJson as unknown as React.FC<{ src: any; collapsed: boolean }>;


export function SellConfigBox({
  sellConfig,
  setSellConfig,
}: {
  sellConfig: SellConfigResponse | undefined;
  setSellConfig: Dispatch<SetStateAction<SellConfigResponse | undefined>>;
}) {
  const [configLoading, setConfigLoading] = useState(false);

  const sellConfigHeaderRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      sellConfigHeaderRef.current = document.getElementById("sellConfigHeader");
    }
  }, []);

  const sellConfigurationWrapper = async () => {
    try {
      setConfigLoading(true);
      const response = await generateSellConfig();
      setConfigLoading(false);
      setSellConfig(response);
    } catch (error) {
      setConfigLoading(false);
      alert(error);
    }
  };

  return (
    <Card id="sellConfigHeader" className="flex flex-col p-10">
      <h1
        className="font-bold mb-1"
        onClick={() =>
          sellConfigHeaderRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      >
        {" "}
        1. Generate Sell Config:{" "}
      </h1>
      <h2>
        The{" "}
        <Link
          isExternal
          href="https://docs.cdp.coinbase.com/onramp/docs/api-configurations/#sell-config"
        >
          {" "}
          Sell Config API{" "}
        </Link>{" "}
        returns the list of countries supported by Coinbase Onramp Sell, and the
        payment methods available in each country.
      </h2>
      <div className="flex flex-row w-full justify-center gap-10 mt-5">
        <Button className="w-full" onClick={sellConfigurationWrapper}>
          {" "}
          Generate Sell Config{" "}
        </Button>
        <Card className="w-full p-5">
          {configLoading
            ? "loading..."
            : sellConfig && <JsonViewer collapsed={true} src={sellConfig} />}
        </Card>
      </div>
    </Card>
  );
}
