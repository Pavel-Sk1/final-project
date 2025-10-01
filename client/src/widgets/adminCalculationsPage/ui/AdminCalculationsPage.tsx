import styles from "./AdminCalculationsPage.module.css";
import type { IOrder } from "@/entities/calculations";

type AdminCalculationsPageProps = {
  orders: IOrder[];
  loading?: boolean;
  error?: string | null;
  selectedDate?: string;
};

export function AdminCalculationsPage({
  orders,
  loading = false,
  error = null,
  selectedDate,
}: AdminCalculationsPageProps) {
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "Сегодня";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Неверная дата";
      }

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return "Сегодня";
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Вчера";
      } else {
        return date.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Неверная дата";
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner}></div>
        <div className={styles.loadingText}>Загрузка заказов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>⚠️</div>
        <div className={styles.errorTitle}>Ошибка загрузки</div>
        <div className={styles.errorDescription}>{error}</div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>📊</div>
        <div className={styles.emptyStateTitle}>Нет подтвержденных заказов</div>
        <div className={styles.emptyStateDescription}>
          На {selectedDate ? formatDate(selectedDate) : "выбранную дату"}{" "}
          подтвержденные заказы не найдены
        </div>
      </div>
    );
  }

  const extendedOrders = orders as IOrder[];

  if (!extendedOrders || extendedOrders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>📊</div>
        <div className={styles.emptyStateTitle}>Нет подтвержденных заказов</div>
        <div className={styles.emptyStateDescription}>
          На {selectedDate ? formatDate(selectedDate) : "выбранную дату"}{" "}
          подтвержденные заказы не найдены
        </div>
      </div>
    );
  }

  const userMap = new Map<string, { name: string; username?: string }>();
  extendedOrders.forEach((order) => {
    if (order.tgUser) {
      
      let displayName = `ID: ${order.tgUser.tg_user_id}`;

      if (order.tgUser.user?.partner?.company_name) {
        displayName = order.tgUser.user.partner.company_name;
      } else if (order.tgUser.first_name) {
        displayName = order.tgUser.first_name;
      } else if (order.tgUser.tg_username) {
        displayName = order.tgUser.tg_username;
      }

      userMap.set(order.tgUser.tg_user_id, {
        name: displayName,
        username: order.tgUser.tg_username,
      });
    }
  });

  const uniqueUserIds = Array.from(userMap.keys());

  const productMap = new Map<
    string,
    {
      name: string;
      price: number;
      variants?: string[];
      variant_names?: string[];
    }
  >();
  const productOrdersMap = new Map<
    string,
    Map<string, { fried: number; baked: number }>
  >();

  extendedOrders.forEach((order) => {
    
    const productKey = `${order.product_id}`;

    if (order.product && !productMap.has(productKey)) {
      productMap.set(productKey, {
        name: order.product.name,
        price: order.product.price,
        variants: order.product.variants,
        variant_names: order.product.variant_names,
      });
    }

    if (!productOrdersMap.has(productKey)) {
      productOrdersMap.set(productKey, new Map());
    }

    const userOrdersMap = productOrdersMap.get(productKey)!;
    if (!userOrdersMap.has(order.tg_user_id)) {
      userOrdersMap.set(order.tg_user_id, { fried: 0, baked: 0 });
    }

    const userVariants = userOrdersMap.get(order.tg_user_id)!;

    if (order.variant === "ж" || order.variant === "жар") {
      userVariants.fried += order.quantity;
    } else if (order.variant === "п" || order.variant === "печ") {
      userVariants.baked += order.quantity;
    } else {
      
      userVariants.fried += order.quantity;
    }
  });

  const totalByUser = new Map<string, number>();
  const totalByProduct = new Map<string, number>();
  const quantityByProduct = new Map<string, { fried: number; baked: number }>();

  productOrdersMap.forEach((userOrdersMap, productKey) => {
    const product = productMap.get(productKey);
    if (!product) return;

    let productTotal = 0;
    let productFriedQuantity = 0;
    let productBakedQuantity = 0;

    userOrdersMap.forEach((variants, userId) => {
      const totalQuantity = variants.fried + variants.baked;
      const userTotal = totalByUser.get(userId) || 0;
      totalByUser.set(userId, userTotal + totalQuantity * product.price);
      productTotal += totalQuantity * product.price;
      productFriedQuantity += variants.fried;
      productBakedQuantity += variants.baked;
    });

    totalByProduct.set(productKey, productTotal);
    quantityByProduct.set(productKey, {
      fried: productFriedQuantity,
      baked: productBakedQuantity,
    });
  });

  const handlePrintOrder = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = generatePrintContent();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Заявка на ${
            selectedDate ? formatDate(selectedDate) : "выбранную дату"
          }</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #000; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #000; 
              padding-bottom: 15px; 
            }
            .header h1 { 
              margin: 0; 
              font-size: 24px; 
            }
            .header p { 
              margin: 5px 0; 
              font-size: 14px; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 20px; 
            }
            th, td { 
              border: 1px solid #000; 
              padding: 8px; 
              text-align: left; 
              font-size: 12px; 
            }
            th { 
              background-color: #f0f0f0; 
              font-weight: bold; 
              text-align: center; 
            }
            .product-cell { 
              font-weight: bold; 
            }
            .total-row { 
              background-color: #f5f5f5; 
              font-weight: bold; 
            }
            .summary { 
              margin-top: 20px; 
              border-top: 2px solid #000; 
              padding-top: 15px; 
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const generatePrintContent = () => {
    const totalAmount = Array.from(totalByUser.values()).reduce(
      (sum, total) => sum + total,
      0
    );
    const currentDate = new Date().toLocaleDateString("ru-RU");

    let content = `
      <div class="header">
        <h1>ЗАЯВКА НА ПОСТАВКУ</h1>
        <p><strong>Дата заявки:</strong> ${
          selectedDate ? formatDate(selectedDate) : currentDate
        }</p>
        <p><strong>Дата формирования:</strong> ${currentDate}</p>
        <p><strong>Количество заказов:</strong> ${orders.length}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 30%;">Наименование товара</th>
    `;

    uniqueUserIds.forEach((userId) => {
      const userInfo = userMap.get(userId);
      content += `<th style="width: ${Math.floor(
        60 / uniqueUserIds.length
      )}%;">${userInfo?.name || userId}</th>`;
    });

    content += `
            <th style="width: 8%;">Количество</th>
            <th style="width: 10%;">Итого (₽)</th>
          </tr>
        </thead>
        <tbody>
    `;

    Array.from(productOrdersMap.entries()).forEach(
      ([productKey, userOrdersMap]) => {
        const product = productMap.get(productKey);
        if (!product) return;

        content += `
        <tr>
          <td class="product-cell">${product.name}</td>
      `;

        uniqueUserIds.forEach((userId) => {
          const variants = userOrdersMap.get(userId) || { fried: 0, baked: 0 };
          const hasVariants = product.variants && product.variants.length > 0;

          if (hasVariants && (variants.fried > 0 || variants.baked > 0)) {
            content += `<td style="text-align: center;">${variants.fried}/${variants.baked}</td>`;
          } else {
            const totalQuantity = variants.fried + variants.baked;
            content += `<td style="text-align: center;">${
              totalQuantity || 0
            }</td>`;
          }
        });

        const quantities = quantityByProduct.get(productKey);
        const hasVariants = product.variants && product.variants.length > 0;
        let quantityDisplay = "0";

        if (quantities) {
          if (hasVariants && (quantities.fried > 0 || quantities.baked > 0)) {
            quantityDisplay = `${quantities.fried}/${quantities.baked}`;
          } else {
            quantityDisplay = `${quantities.fried + quantities.baked}`;
          }
        }

        content += `<td style="text-align: center; font-weight: bold;">${quantityDisplay}</td>`;
        content += `<td style="text-align: center; font-weight: bold;">${
          totalByProduct.get(productKey) || 0
        }₽</td>`;
        content += `</tr>`;
      }
    );

    content += `
        <tr class="total-row">
          <td><strong>ИТОГО</strong></td>
    `;

    uniqueUserIds.forEach((userId) => {
      const userTotal = totalByUser.get(userId) || 0;
      content += `<td style="text-align: center;"><strong>${userTotal}₽</strong></td>`;
    });

    const totalFried = Array.from(quantityByProduct.values()).reduce(
      (sum, quantities) => sum + quantities.fried,
      0
    );
    const totalBaked = Array.from(quantityByProduct.values()).reduce(
      (sum, quantities) => sum + quantities.baked,
      0
    );

    const totalQuantityDisplay = `${totalFried + totalBaked}`;

    content += `
          <td style="text-align: center;"><strong>${totalQuantityDisplay}</strong></td>
          <td style="text-align: center;"><strong>${totalAmount}₽</strong></td>
        </tr>
        </tbody>
      </table>

      <div class="summary">
        <p><strong>Общая сумма заказа:</strong> ${totalAmount}₽</p>
        <p><strong>Общее количество товаров:</strong> ${totalQuantityDisplay}</p>
        <p><strong>Количество позиций:</strong> ${productOrdersMap.size}</p>
        <p><strong>Количество магазинов:</strong> ${uniqueUserIds.length}</p>
      </div>
    `;

    return content;
  };

  return (
    <div className={styles.calculationsTable}>
      <div className={styles.tableHeaderContainer}>
        <div className={styles.tableTitle}>
          ✅ Подтвержденные заказы за{" "}
          {selectedDate ? formatDate(selectedDate) : "выбранную дату"} (
          {orders.length} заказов)
        </div>
        <button
          onClick={handlePrintOrder}
          className={styles.printButton}
          title="Распечатать заявку"
        >
          🖨️ Печать заявки
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Продукт</th>
            {uniqueUserIds.map((userId) => {
              const userInfo = userMap.get(userId);
              return (
                <th
                  key={userId}
                  className={styles.tableHeader}
                  title={
                    userInfo?.username ? `@${userInfo.username}` : undefined
                  }
                >
                  {userInfo?.name || userId}
                </th>
              );
            })}
            <th
              className={styles.tableHeader}
              title="Общее количество товаров (жареные/печеные для продуктов с вариантами)"
            >
              Количество
            </th>
            <th className={styles.tableHeader}>Итого</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(productOrdersMap.entries()).map(
            ([productKey, userOrdersMap]) => {
              const product = productMap.get(productKey);
              return (
                <tr key={productKey}>
                  <td
                    className={styles.tableCell}
                    title={`Цена: ${product?.price || 0}₽`}
                  >
                    {product?.name || `Продукт #${productKey}`}
                  </td>
                  {uniqueUserIds.map((userId) => {
                    const variants = userOrdersMap.get(userId) || {
                      fried: 0,
                      baked: 0,
                    };
                    const totalQuantity = variants.fried + variants.baked;
                    const total = totalQuantity * (product?.price || 0);

                    const hasVariants =
                      product?.variants && product.variants.length > 0;

                    return (
                      <td
                        key={userId}
                        className={styles.tableCell}
                        title={
                          hasVariants
                            ? `Жареные: ${variants.fried}, Печеные: ${
                                variants.baked
                              } (${totalQuantity} × ${
                                product?.price || 0
                              }₽ = ${total}₽)`
                            : `${totalQuantity} × ${
                                product?.price || 0
                              }₽ = ${total}₽`
                        }
                      >
                        {hasVariants &&
                        (variants.fried > 0 || variants.baked > 0)
                          ? `${variants.fried}/${variants.baked}`
                          : totalQuantity || 0}
                      </td>
                    );
                  })}
                  <td
                    className={`${styles.tableCell} ${styles.quantityColumn}`}
                    title={(() => {
                      const quantities = quantityByProduct.get(productKey);
                      if (!quantities) return "Нет заказов";

                      const hasVariants =
                        product?.variants && product.variants.length > 0;
                      if (hasVariants) {
                        return `Жареные: ${quantities.fried}, Печеные: ${
                          quantities.baked
                        }, Всего: ${quantities.fried + quantities.baked}`;
                      } else {
                        return `Общее количество: ${
                          quantities.fried + quantities.baked
                        }`;
                      }
                    })()}
                  >
                    {(() => {
                      const quantities = quantityByProduct.get(productKey);
                      if (!quantities) return 0;

                      const hasVariants =
                        product?.variants && product.variants.length > 0;
                      if (
                        hasVariants &&
                        (quantities.fried > 0 || quantities.baked > 0)
                      ) {
                        return `${quantities.fried}/${quantities.baked}`;
                      } else {
                        return quantities.fried + quantities.baked;
                      }
                    })()}
                  </td>
                  <td className={`${styles.tableCell} ${styles.boldCell}`}>
                    {totalByProduct.get(productKey) || 0}₽
                  </td>
                </tr>
              );
            }
          )}
          <tr className={styles.totalRow}>
            <td className={`${styles.tableCell} ${styles.totalCell}`}>ИТОГО</td>
            {uniqueUserIds.map((userId) => {
              const userTotal = totalByUser.get(userId) || 0;
              return (
                <td
                  key={userId}
                  className={`${styles.tableCell} ${styles.totalCell}`}
                >
                  {userTotal}₽
                </td>
              );
            })}
            <td className={`${styles.tableCell} ${styles.totalQuantityCell}`}>
              {Array.from(quantityByProduct.values()).reduce(
                (sum, quantities) => sum + quantities.fried + quantities.baked,
                0
              )}
            </td>
            <td className={`${styles.tableCell} ${styles.totalQuantityCell}`}>
              {Array.from(totalByUser.values()).reduce(
                (sum, total) => sum + total,
                0
              )}
              ₽
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
