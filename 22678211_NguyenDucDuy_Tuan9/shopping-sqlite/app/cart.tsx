import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getCart, updateQty, deleteCartItem, clearCart } from '../src/db/cart.repo';

export default function CartScreen() {
  const [items, setItems] = useState<any[]>([]); // Danh sách sản phẩm trong giỏ hàng
  const router = useRouter(); // Dùng để điều hướng giữa các màn hình

  const loadCart = () => setItems(getCart()); // Hàm tải lại dữ liệu giỏ hàng

  useEffect(() => {
    loadCart(); // Tải dữ liệu khi mở màn hình
  }, []);

  const handleDelete = (id: number) => { // Xóa 1 sản phẩm khỏi giỏ
    deleteCartItem(id);
    loadCart();
  };

  const handleIncrease = (id: number, qty: number) => { // Tăng số lượng sản phẩm
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (qty + 1 > item.stock) {
      Alert.alert('Lỗi', `Không thể tăng số lượng. Tồn kho hiện có: ${item.stock}.`);
      return;
    }
    updateQty(id, qty + 1);
    loadCart();
  };

  const handleDecrease = (id: number, qty: number) => { // Giảm số lượng sản phẩm
    if (qty - 1 <= 0) {
      Alert.alert('Lỗi', 'Số lượng phải lớn hơn 0.');
      return;
    }
    updateQty(id, qty - 1);
    loadCart();
  };

  const handleClearCart = () => { // Xóa toàn bộ giỏ hàng
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa toàn bộ giỏ hàng?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => {
          clearCart();
          loadCart();
        } 
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Danh sách sản phẩm trong giỏ */}
      <FlatList
        data={items}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemText}>
              {item.name} - {item.price.toLocaleString()}đ x {item.qty}
            </Text>
            <View style={styles.buttonRow}>
              <View style={styles.button}>
                <Button title="+" onPress={() => handleIncrease(item.id, item.qty)} />
              </View>
              <View style={styles.button}>
                <Button title="-" onPress={() => handleDecrease(item.id, item.qty)} />
              </View>
              <View style={styles.button}>
                <Button title="Xóa" color="red" onPress={() => handleDelete(item.id)} />
              </View>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />} // Khoảng cách giữa các sản phẩm
      />

      {/* Các nút dưới cùng */}
      <View style={styles.invoiceButton}>
        <Button title="Xóa toàn bộ giỏ hàng" color="red" onPress={handleClearCart} />
        <Button title="Xem hóa đơn" onPress={() => router.push('/invoice')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  itemCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  button: {
    marginRight: 10,
    width: 50,
  },
  invoiceButton: {
    marginTop: 20,
  },
});
