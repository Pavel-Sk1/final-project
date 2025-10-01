import { useEffect } from "react";
import styles from "./AdminPartnerList.module.css";
import { useAppDispatch, useAppSelector } from "@/shared";
import { getAllPartnersWithUserThunk } from "@/entities";
import { AdminPartnerCard } from "@/widgets";

export function AdminPartnerList() {
  const dispatch = useAppDispatch();
  const { partnersArrayWithUser } = useAppSelector((state) => state.partner);

  useEffect(() => {
    try {
      dispatch(getAllPartnersWithUserThunk());
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  return (
    <div className={styles.itemsContainer}>
      {partnersArrayWithUser.map((partner) => (
        <AdminPartnerCard key={partner.id} partner={partner} />
      ))}
    </div>
  );
}
