"use client";

import { useEffect, useState } from "react";
import { api } from "@/api/index";
import { TestResult, TestSummary } from "@/types";
import TestSummaryComponent from "@/components/TestSummary";
import TestResultsComponent from "@/components/TestResults";

export default function TestsPage() {
  const [summary, setSummary] = useState<TestSummary | null>(null);
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTests();
    const interval = setInterval(fetchTests, 5000); // every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTests = async () => {
    try {
      const [summaryData, testsData] = await Promise.all([
        api.getTestsSummary(),
        api.getAllTests(),
      ]);
      setSummary(summaryData);
      setTests(testsData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Test Results</h1>
      {summary && <TestSummaryComponent summary={summary} />}
      {tests.length > 0 && <TestResultsComponent tests={tests} />}
    </div>
  );
}
