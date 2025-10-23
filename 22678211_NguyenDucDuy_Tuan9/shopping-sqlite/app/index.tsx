import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getAllProducts } from '../src/db/product.repo';
import { addToCart, getCartItemById } from '../src/db/cart.repo';
import { Product } from '../src/models/types';

// Màn hình hiển thị danh sách sản phẩm
export default function ProductsScreen() {
    // State dùng để lưu danh sách sản phẩm lấy từ cơ sở dữ liệu
    const [products, setProducts] = useState<Product[]>([]);
    // Dùng useRouter để điều hướng sang các màn hình khác như /cart
    const router = useRouter();

    // Khi component được mount lần đầu tiên, gọi hàm lấy danh sách sản phẩm
    useEffect(() => {
        setProducts(getAllProducts());
    }, []);

    // Hàm xử lý khi người dùng nhấn nút "Thêm vào giỏ"
    const handleAddToCart = (product: Product) => {
        // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
        const cartItem = getCartItemById(product.product_id);
        const currentQty = cartItem ? cartItem.qty : 0;

        // Kiểm tra vượt tồn kho
        if (currentQty + 1 > product.stock) {
            Alert.alert('Lỗi', `Không thể thêm, số lượng vượt quá tồn kho (${product.stock}).`);
            return;
        }

        // Kiểm tra số lượng hợp lệ
        if (currentQty + 1 <= 0) {
            Alert.alert('Lỗi', 'Số lượng phải lớn hơn 0.');
            return;
        }

        // Gọi hàm thêm sản phẩm vào giỏ
        addToCart(product.product_id);
    };

    // Giao diện hiển thị
    return (
        <View style={styles.container}>
            <FlatList
                data={products} // nguồn dữ liệu danh sách sản phẩm
                keyExtractor={(item) => item.product_id} // khóa duy nhất cho từng phần tử
                renderItem={({ item }) => (
                    <View style={styles.productCard}>
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text style={styles.productPrice}>{item.price.toLocaleString()}đ</Text>
                        <Text style={styles.productStock}>Tồn kho: {item.stock}</Text>
                        <View style={styles.buttonWrapper}>
                            <Button title="Thêm vào giỏ" onPress={() => handleAddToCart(item)} />
                        </View>
                    </View>
                )}
                // Ngăn cách giữa các sản phẩm
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                // Nút chuyển sang trang Giỏ hàng ở cuối danh sách
                ListFooterComponent={
                    <View style={styles.cartButtonWrapper}>
                        <Button title="Xem giỏ hàng" onPress={() => router.push('/cart')} />
                        <View style={{ marginTop: 10 }}>
                            <Button title="📋 Lịch sử hóa đơn" onPress={() => router.push('/history')} color="#28a745" />
                        </View>
                    </View>
                }
            />
        </View>
    );
}

// Các style cơ bản cho giao diện
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f2f2f2',
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    productName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        color: '#4caf50',
        marginBottom: 4,
    },
    productStock: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
    },
    buttonWrapper: {
        alignSelf: 'flex-start',
        width: 140,
    },
    separator: {
        height: 12,
    },
    cartButtonWrapper: {
        marginTop: 20,
        marginBottom: 20,
    },
});
