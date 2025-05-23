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
import { generateBuyConfig } from "../utils/queries";
import { BuyConfigResponse } from "../utils/types";
import dynamic from "next/dynamic";
const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });
const JsonViewer = ReactJson as unknown as React.FC<{ src: any; collapsed: boolean }>;


export function BuyConfigBox({
  buyConfig,
  setBuyConfig,
}: {
  buyConfig: BuyConfigResponse | undefined;
  setBuyConfig: Dispatch<SetStateAction<BuyConfigResponse | undefined>>;
}) {
  const [configLoading, setConfigLoading] = useState(false);

  const buyConfigHeaderRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (document) {
      buyConfigHeaderRef.current = document.getElementById("buyConfigHeader");
    }
  }, []);

  const buyConfigurationWrapper = async () => {
    try {
      setConfigLoading(true);
      const response = await generateBuyConfig();
      setConfigLoading(false);
      setBuyConfig(response);
    } catch (error) {
      setConfigLoading(false);
      alert(error);
    }
  };

  return (
    <Card id="buyConfigHeader" className="flex flex-col p-10">
      <h1
        className="font-bold mb-1"
        onClick={() =>
          buyConfigHeaderRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      >
        {" "}
        1. Generate Buy Config:{" "}
      </h1>
      <h2>
        The{" "}
        <Link
          isExternal
          href="https://docs.cdp.coinbase.com/onramp/docs/api-configurations/#buy-config"
        >
          {" "}
          Buy Config API{" "}
        </Link>{" "}
        returns the list of countries supported by Coinbase Onramp Buy, and the
        payment methods available in each country.
      </h2>
      <div className="flex flex-row w-full justify-center gap-10 mt-5">
        <Button className="w-full" onClick={buyConfigurationWrapper}>
          {" "}
          Generate Buy Config{" "}
        </Button>
        <Card className="w-full p-5">
          {configLoading
            ? "loading..."
            : buyConfig && <JsonViewer collapsed={true} src={buyConfig} />}
        </Card>
      </div>
    </Card>
  );
}
