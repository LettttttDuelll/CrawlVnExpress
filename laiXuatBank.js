import axios from "axios";
import fs from "fs";
const url = "https://gw.vnexpress.net/th?types=gia_vang_v2,bank_rate_offline,bank_rate_online";

async function getBankRates() {
  try {
    const { data } = await axios.get(url);

    // Lấy dữ liệu bank_rate_offline
    const rates = data.data.bank_rate_offline;

    fs.writeFileSync("laiXuatBank.json", JSON.stringify(rates, null, 2));

    rates.forEach(item => {
      console.log("Ngân hàng:", item.bank);
      console.log("Ngày cập nhật:", item.update);
      console.log("Lãi suất 1 tháng:", item.rate_1 + "%");
      console.log("Lãi suất 3 tháng:", item.rate_3 + "%");
      console.log("Lãi suất 6 tháng:", item.rate_6 + "%");
      console.log("Lãi suất 9 tháng:", item.rate_9 + "%");
      console.log("Lãi suất 12 tháng:", item.rate_12 + "%");
      console.log("--------------------");
    });

  } catch (err) {
    console.error("Lỗi:", err.message);
  }
}

getBankRates();
