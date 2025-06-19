"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import YueCard from "@/components/card";
import { CorpusItem } from "../types";

// Create a client component for the main content
export default function Main() {
  const searchParams = useSearchParams();
  const [item, setItem] = useState<CorpusItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uniqueId = searchParams.get("uuid");
    if (!uniqueId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://dim-sum-prod.deno.dev/corpus_item?unique_id=${uniqueId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setItem(data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
        // toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams.get("uuid")]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">No data found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <center>
        <h1 className="text-4xl font-bold mb-8">粤语单词卡片生成器</h1>
      </center>

      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 max-w-4xl">
          {item && <YueCard item={item} />}
        </div>
      </div>
    </div>
  );
}
