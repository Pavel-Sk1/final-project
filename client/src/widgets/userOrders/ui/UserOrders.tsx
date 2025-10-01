import styles from "./UserOrders.module.css";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import {
  getUserOrdersThunk,
  createOrderThunk,
  deleteOrderThunk,
  clearOrdersError,
} from "@/entities/orders";
import { getAllProductsThunk } from "@/entities/products";
import type { IOrderItem } from "@/entities/orders";
import type { IProduct } from "@/entities/products";

export function UserOrders() {
  const dispatch = useAppDispatch();
  const {
    orders,
    loading,
    createOrderLoading,
    createOrderError,
    deleteOrderLoading,
  } = useAppSelector((state) => state.orders);
  const { products } = useAppSelector((state) => state.products);

  const [orderItems, setOrderItems] = useState<
    Record<number, { fried: number; baked: number; regular: number }>
  >({});
  const [orderComment, setOrderComment] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  useEffect(() => {
    dispatch(getUserOrdersThunk());
    dispatch(getAllProductsThunk());
  }, [dispatch]);

  const handleQuantityChange = (
    productId: number,
    variant: "fried" | "baked" | "regular",
    quantity: number
  ) => {
    if (quantity < 0) return;
    setOrderItems((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        fried: prev[productId]?.fried || 0,
        baked: prev[productId]?.baked || 0,
        regular: prev[productId]?.regular || 0,
        [variant]: quantity,
      },
    }));
  };

  const handleCreateOrder = () => {
    const items: IOrderItem[] = [];

    Object.entries(orderItems).forEach(([productId, itemData]) => {
      
      if (itemData.fried > 0) {
        items.push({
          product_id: parseInt(productId),
          quantity: itemData.fried,
          variant: "ж",
        });
      }
      
      if (itemData.baked > 0) {
        items.push({
          product_id: parseInt(productId),
          quantity: itemData.baked,
          variant: "п",
        });
      }
      
      if (itemData.regular > 0) {
        items.push({
          product_id: parseInt(productId),
          quantity: itemData.regular,
        });
      }
    });

    if (items.length === 0) {
      alert("Выберите хотя бы один продукт для заказа");
      return;
    }

    dispatch(
      createOrderThunk({
        items,
        user_comment: orderComment || undefined,
      })
    ).then(() => {
      setOrderItems({});
      setOrderComment("");
      setShowOrderForm(false);
      dispatch(clearOrdersError());
    });
  };

  const getTotalPrice = () => {
    return Object.entries(orderItems).reduce((total, [productId, itemData]) => {
      const product = products.find((p) => p.id === parseInt(productId));
      const totalQuantity =
        (itemData.fried || 0) + (itemData.baked || 0) + (itemData.regular || 0);
      return total + (product ? product.price * totalQuantity : 0);
    }, 0);
  };

  const getSelectedItemsCount = () => {
    return Object.values(orderItems).reduce(
      (sum, itemData) =>
        sum +
        (itemData.fried || 0) +
        (itemData.baked || 0) +
        (itemData.regular || 0),
      0
    );
  };

  const handleDeleteOrder = (orderId: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот заказ?")) {
      dispatch(deleteOrderThunk(orderId));
    }
  };

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const isOrderExpanded = (orderId: number) => {
    return expandedOrders.has(orderId);
  };

  if (loading) {
    return (
      <div className={styles.ordersSection}>
        <div className={styles.loading}>Загрузка заказов...</div>
      </div>
    );
  }

  return (
    <div className={styles.ordersSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Мои заказы</h2>
        <button
          className={styles.newOrderBtn}
          onClick={() => setShowOrderForm(!showOrderForm)}
        >
          {showOrderForm ? "Отменить" : "Новый заказ"}
        </button>
      </div>

      {showOrderForm && (
        <div className={styles.orderForm}>
          <h3 className={styles.formTitle}>Создать заказ</h3>

          <div className={styles.productsTable}>
            <table>
              <thead>
                <tr>
                  <th>Продукт</th>
                  <th>Цена</th>
                  <th>Жареные</th>
                  <th>Печеные</th>
                  <th>Обычные</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: IProduct) => {
                  const hasVariants =
                    product.variants && product.variants.length > 0;
                  const currentItem = orderItems[product.id] || {
                    fried: 0,
                    baked: 0,
                    regular: 0,
                  };
                  const totalQuantity =
                    currentItem.fried + currentItem.baked + currentItem.regular;

                  return (
                    <tr key={product.id}>
                      <td>
                        <div className={styles.productInfo}>
                          {product.img && (
                            <img
                              src={product.img}
                              alt={product.name}
                              className={styles.productImage}
                            />
                          )}
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td>{product.price} ₽</td>
                      <td>
                        {hasVariants ? (
                          <div className={styles.quantityControls}>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  product.id,
                                  "fried",
                                  currentItem.fried - 1
                                )
                              }
                              disabled={currentItem.fried <= 0}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={currentItem.fried}
                              onChange={(e) =>
                                handleQuantityChange(
                                  product.id,
                                  "fried",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className={styles.quantityInput}
                            />
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  product.id,
                                  "fried",
                                  currentItem.fried + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className={styles.noVariants}>-</span>
                        )}
                      </td>
                      <td>
                        {hasVariants ? (
                          <div className={styles.quantityControls}>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  product.id,
                                  "baked",
                                  currentItem.baked - 1
                                )
                              }
                              disabled={currentItem.baked <= 0}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={currentItem.baked}
                              onChange={(e) =>
                                handleQuantityChange(
                                  product.id,
                                  "baked",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className={styles.quantityInput}
                            />
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  product.id,
                                  "baked",
                                  currentItem.baked + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className={styles.noVariants}>-</span>
                        )}
                      </td>
                      <td>
                        {!hasVariants ? (
                          <div className={styles.quantityControls}>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  product.id,
                                  "regular",
                                  currentItem.regular - 1
                                )
                              }
                              disabled={currentItem.regular <= 0}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={currentItem.regular}
                              onChange={(e) =>
                                handleQuantityChange(
                                  product.id,
                                  "regular",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className={styles.quantityInput}
                            />
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  product.id,
                                  "regular",
                                  currentItem.regular + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className={styles.noVariants}>-</span>
                        )}
                      </td>
                      <td>
                        {(totalQuantity * product.price).toLocaleString()} ₽
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.orderSummary}>
            <div className={styles.summaryRow}>
              <span>Товаров: {getSelectedItemsCount()}</span>
              <span>Итого: {getTotalPrice().toLocaleString()} ₽</span>
            </div>
          </div>

          <div className={styles.commentSection}>
            <label htmlFor="orderComment">Комментарий к заказу:</label>
            <textarea
              id="orderComment"
              value={orderComment}
              onChange={(e) => setOrderComment(e.target.value)}
              placeholder="Дополнительные пожелания к заказу..."
              className={styles.commentInput}
            />
          </div>

          {createOrderError && (
            <div className={styles.error}>{createOrderError}</div>
          )}

          <div className={styles.formActions}>
            <button
              onClick={handleCreateOrder}
              disabled={createOrderLoading || getSelectedItemsCount() === 0}
              className={styles.submitBtn}
            >
              {createOrderLoading ? "Создание заказа..." : "Создать заказ"}
            </button>
          </div>
        </div>
      )}

      <div className={styles.ordersContent}>
        {orders.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <h3 className={styles.emptyTitle}>Заказов пока нет</h3>
            <p className={styles.emptyDescription}>
              Создайте свой первый заказ, нажав кнопку "Новый заказ"
            </p>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div
                  className={styles.orderHeader}
                  onClick={() => toggleOrderExpansion(order.id)}
                >
                  <div className={styles.orderHeaderLeft}>
                    <button className={styles.expandBtn}>
                      {isOrderExpanded(order.id) ? "▼" : "▶"}
                    </button>
                    <span className={styles.orderId}>Заказ #{order.id}</span>
                    <span className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <div className={styles.orderHeaderRight}>
                    <span
                      className={`${styles.orderStatus} ${
                        styles[order.status]
                      }`}
                    >
                      {order.status === "pending" && "Ожидает подтверждения"}
                      {order.status === "confirmed" && "Подтвержден"}
                      {order.status === "cancelled" && "Отменен"}
                      {order.status === "completed" && "Выполнен"}
                    </span>
                    {order.status === "pending" && (
                      <button
                        className={styles.deleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOrder(order.id);
                        }}
                        disabled={deleteOrderLoading}
                        title="Удалить заказ"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
                {isOrderExpanded(order.id) && (
                  <div className={styles.orderContent}>
                    <div className={styles.orderItems}>
                      {order.items && order.items.length > 0 ? (
                        <>
                          <div className={styles.orderItemsHeader}>
                            <span>Товар</span>
                            <span>Количество</span>
                            <span>Цена</span>
                          </div>
                          {order.items.map((item, index) => {
                            
                            const product = item.product;
                            return (
                              <div key={index} className={styles.orderItem}>
                                <span className={styles.productName}>
                                  {product?.name ||
                                    `Продукт #${item.product_id}`}
                                  {item.variant && ` (${item.variant})`}
                                </span>
                                <span className={styles.quantity}>
                                  {item.quantity} шт.
                                </span>
                                <span className={styles.price}>
                                  {product
                                    ? (
                                        product.price * item.quantity
                                      ).toLocaleString()
                                    : 0}{" "}
                                  ₽
                                </span>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <div className={styles.orderItem}>
                          <span>Нет товаров в заказе</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.orderTotal}>
                      <strong>
                        Итого: {order.total_price.toLocaleString()} ₽
                      </strong>
                    </div>
                    {order.user_comment && (
                      <div className={styles.userComment}>
                        <strong>Ваш комментарий:</strong> {order.user_comment}
                      </div>
                    )}
                    {order.admin_comment && (
                      <div className={styles.adminComment}>
                        <strong>Комментарий администратора:</strong>{" "}
                        {order.admin_comment}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
