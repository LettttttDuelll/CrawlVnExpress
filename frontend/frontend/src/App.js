import React, { useState } from "react";

export default function GoogleClone() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(""); // ✅ state lưu kết quả trả về

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/crawl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: query }),
      });

      const data = await response.json();
      console.log("Kết quả từ backend:", data);
      setResult(JSON.stringify(data)); // ✅ lưu vào state
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      setResult("❌ Dữ liệu không hợp lệ hoặc lỗi server");
    };
  };
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-pink-200">
        {/* Tiêu đề */}
        <h1 className="text-6xl font-bold text-gray-800 mb-10">Google.vn</h1>
        <h2 className="text-2xl text-gray-700 mb-5">Crawl VnExpress</h2>
        {/* Thanh tìm kiếm */}
        <div className="w-[50vw]">
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white rounded-full border border-gray-300 shadow-sm hover:shadow-md focus-within:shadow-md transition duration-200 px-5 py-3"
          >
            <input
              type="text"
              placeholder="Type a URL"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow bg-transparent outline-none text-xl px-2"
            />
            <button
              type="submit"
              className="text-gray-500 hover:text-gray-700 transition duration-200 text-2xl"
            >
              🔍
            </button>
          </form>

          {/* Hiển thị kết quả */}
          <div className="mt-10 text-gray-600">
            {result ? result : "⚡ Nhập URL và bấm search để crawl"}
          </div>
        </div>
        <div className="fixed bottom-5 right-5 flex flex-col space-y-3">
          <div className="bg-white text-gray-800 shadow-lg rounded-xl px-5 py-3 border border-gray-200">
            🕕 Crawl tự động vào <span className="font-semibold">6h sáng</span>
          </div>

          <div className="bg-white text-gray-800 shadow-lg rounded-xl px-5 py-3 border border-gray-200">
            ✅ VnExpress, BaoNghệAn, DânTrí, VietnamNet, 24h, TiềnPhong
          </div>
        </div>
      </div>
    );
  }
