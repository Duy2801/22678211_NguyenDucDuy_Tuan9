import { View, Text, ScrollView, StyleSheet, Button, Alert } from "react-native";
import { useEffect, useState } from "react";
import { getCart } from "../src/db/cart.repo";      // Hàm lấy giỏ hàng hiện tại từ CSDL (SQLite)
import { checkout } from '../src/db/order.repo';     // Hàm xử lý thanh toán, tạo hóa đơn

// COMPONENT CHÍNH
export default function InvoiceScreen() {
  // State lưu danh sách sản phẩm trong giỏ hàng
  const [items, setItems] = useState<any[]>([]);
  // State lưu tổng tiền (chưa VAT)
  const [total, setTotal] = useState(0);
  // useEffect chạy khi mở màn hình
  useEffect(() => {
    const cart = getCart(); // Lấy dữ liệu giỏ hàng từ DB
    setItems(cart);         // Cập nhật danh sách sản phẩm
    setTotal(
      Number(cart.reduce((s: number, i: any) => s + i.qty * i.price, 0))
    ); // Tính tổng tiền
  }, []);

  // Hàm làm mới lại dữ liệu giỏ hàng (sau khi thanh toán xong)
  const refresh = async () => {
    const rows = await getCart();
    setItems(rows);
    setTotal(rows.reduce((acc, r) => acc + r.qty * r.price, 0));
  };

  // Tính VAT (10%)
  const VAT = total * 0.1;

  // Xử lý nút "Thanh toán"
  const handleCheckout = async () => {
    const ok = await checkout(); // Gọi hàm thanh toán trong DB

    if (ok) {
      // Nếu thanh toán thành công
      Alert.alert('Thanh toán thành công', 'Cảm ơn bạn đã mua hàng!', [
        { text: 'OK', onPress: () => refresh() }, // Sau khi bấm OK, làm mới giỏ hàng
      ]);
    } else {
      // Nếu giỏ hàng trống
      Alert.alert('Giỏ hàng trống', 'Không có sản phẩm để thanh toán.');
    }
  };

  // GIAO DIỆN HIỂN THỊ HÓA ĐƠN
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hóa đơn</Text>

      {/* Hiển thị danh sách sản phẩm trong giỏ */}
      {items.map((i, idx) => (
        <View key={idx} style={styles.itemRow}>
          <Text style={styles.itemName}>
            {i.name} x {i.qty}
          </Text>
          <Text style={styles.itemPrice}>
            {(i.qty * i.price).toLocaleString()}đ
          </Text>
        </View>
      ))}

      <View style={styles.separator} />

      {/* Phần tổng kết hóa đơn */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tổng:</Text>
        <Text style={styles.summaryValue}>{total.toLocaleString()}đ</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>VAT (10%):</Text>
        <Text style={styles.summaryValue}>{VAT.toLocaleString()}đ</Text>
      </View>

      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={[styles.summaryLabel, styles.totalLabel]}>
          Thành tiền:
        </Text>
        <Text style={[styles.summaryValue, styles.totalValue]}>
          {(total + VAT).toLocaleString()}đ
        </Text>
      </View>

      {/* Nút thanh toán */}
      <View style={{ marginTop: 30 }}>
        <Button
          title="💳 Thanh toán"
          onPress={handleCheckout}
          color="#007AFF"
        />
      </View>

      {/* Ngày giờ in hóa đơn */}
      <Text style={styles.date}>Ngày: {new Date().toLocaleString()}</Text>
    </ScrollView>
  );
}
// STYLE CHO GIAO DIỆN
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 18,
  },
  summaryValue: {
    fontSize: 18,
  },
  totalRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 10,
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 20,
  },
  totalValue: {
    fontWeight: "bold",
    fontSize: 20,
  },
  date: {
    marginTop: 20,
    fontStyle: "italic",
    fontSize: 14,
    textAlign: "right",
    color: "#555",
  },
});
