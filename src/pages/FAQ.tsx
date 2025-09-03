import React, { useState } from "react";
import { useFaqsQuery } from "../features/api/landingApi";
import { LineSkeleton } from "../components/Skeleton";

export default function FAQ() {
  const { data, isLoading } = useFaqsQuery(undefined); // data: QA[] | undefined
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
        Frequently Asked Questions
      </h1>

      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4">
              <LineSkeleton className="w-2/3 mb-3" />
              <LineSkeleton className="w-5/6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {(data ?? []).map((item, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-800 hover:bg-gray-50"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium">{item.q}</span>
                <span className="ml-2 text-xl font-bold">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="mt-10 text-center text-sm text-gray-600">
          Didn’t find what you’re looking for?{" "}
          <a className="text-indigo-600 hover:underline" href="/contact">
            Contact Support
          </a>
          .
        </div>
      )}
    </div>
  );
}
