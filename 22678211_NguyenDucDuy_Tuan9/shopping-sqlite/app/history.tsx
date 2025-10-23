import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { getAllOrders, getOrderDetails } from "../src/db/order.repo";
import { Order, OrderItem } from "../src/models/types";

// COMPONENT CHÍNH - LỊCH SỬ HÓA ĐƠN
export default function HistoryScreen() {
  // State lưu danh sách đơn hàng
  const [orders, setOrders] = useState<Order[]>([]);
  // State lưu đơn hàng được chọn để xem chi tiết
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  // State lưu chi tiết sản phẩm của đơn hàng
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  // State loading
  const [loading, setLoading] = useState(true);

  // Load danh sách đơn hàng khi màn hình được mở
  useEffect(() => {
    loadOrders();
  }, []);

  // Hàm tải danh sách đơn hàng từ database
  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi nhấn vào một đơn hàng để xem chi tiết
  const handleOrderPress = async (orderId: number) => {
    if (selectedOrder === orderId) {
      // Nếu đang mở thì đóng lại
      setSelectedOrder(null);
      setOrderItems([]);
    } else {
      // Mở chi tiết đơn hàng
      setSelectedOrder(orderId);
      const items = await getOrderDetails(orderId);
      setOrderItems(items);
    }
  };

  // Định dạng ngày giờ
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Nếu đang tải dữ liệu
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
      </View>
    );
  }

  // Nếu không có đơn hàng nào
  if (orders.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>📋</Text>
        <Text style={styles.emptySubText}>Chưa có đơn hàng nào</Text>
      </View>
    );
  }

  // GIAO DIỆN HIỂN THỊ LỊCH SỬ ĐƠN HÀNG
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lịch sử hóa đơn</Text>
      <Text style={styles.subtitle}>Tổng: {orders.length} đơn hàng</Text>

      {orders.map((order) => (
        <View key={order.order_id} style={styles.orderCard}>
          {/* Phần tóm tắt đơn hàng - có thể nhấn để xem chi tiết */}
          <TouchableOpacity
            style={styles.orderHeader}
            onPress={() => handleOrderPress(order.order_id)}
          >
            <View style={styles.orderHeaderLeft}>
              <Text style={styles.orderId}>
                Đơn hàng #{order.order_id}
              </Text>
              <Text style={styles.orderDate}>
                {formatDate(order.order_date)}
              </Text>
            </View>
            <View style={styles.orderHeaderRight}>
              <Text style={styles.orderTotal}>
                {order.total.toLocaleString()}đ
              </Text>
              <Text style={styles.expandIcon}>
                {selectedOrder === order.order_id ? "▼" : "▶"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Chi tiết đơn hàng - chỉ hiện khi được chọn */}
          {selectedOrder === order.order_id && (
            <View style={styles.orderDetails}>
              <View style={styles.detailsSeparator} />
              <Text style={styles.detailsTitle}>Chi tiết sản phẩm:</Text>

              {orderItems.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQty}>
                      SL: {item.qty} x {item.price.toLocaleString()}đ
                    </Text>
                  </View>
                  <Text style={styles.itemTotal}>
                    {(item.qty * item.price).toLocaleString()}đ
                  </Text>
                </View>
              ))}

              <View style={styles.detailsSeparator} />

              {/* Tổng kết hóa đơn */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tổng tiền hàng:</Text>
                <Text style={styles.summaryValue}>
                  {order.total.toLocaleString()}đ
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>VAT (10%):</Text>
                <Text style={styles.summaryValue}>
                  {(order.total * 0.1).toLocaleString()}đ
                </Text>
              </View>

              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Thành tiền:</Text>
                <Text style={styles.totalValue}>
                  {(order.total * 1.1).toLocaleString()}đ
                </Text>
              </View>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

// STYLE CHO GIAO DIỆN
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    fontSize: 60,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 18,
    color: "#999",
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: "#666",
  },
  orderHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
  },
  expandIcon: {
    fontSize: 12,
    color: "#999",
  },
  orderDetails: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  detailsSeparator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 12,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 5,
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    color: "#333",
    marginBottom: 2,
  },
  itemQty: {
    fontSize: 13,
    color: "#666",
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#555",
  },
  summaryValue: {
    fontSize: 15,
    color: "#555",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#28a745",
  },
});
