import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initDb } from '../src/db/db';

export default function Layout() {
  useEffect(() => { initDb(); }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Sản phẩm' }} />
      <Stack.Screen name="cart" options={{ title: 'Giỏ hàng' }} />
      <Stack.Screen name="invoice" options={{ title: 'Hóa đơn' }} />
    </Stack>
  );
}
