import { useEffect } from "react";
import styles from "./AdminPartnerList.module.css";
import { useAppDispatch, useAppSelector } from "@/shared";
import { getAllPartnersThunk } from "@/entities";
import { AdminPartnerCard } from "@/widgets";

export function AdminPartnerList() {
  const dispatch = useAppDispatch();
  const { partnersArray } = useAppSelector((state) => state.partner);

  useEffect(() => {
    try {
      dispatch(getAllPartnersThunk());
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  return (
    <div className={styles.itemsContainer}>
      {partnersArray.map((partner) => (
        <AdminPartnerCard key={partner.id} partner={partner} />
      ))}
    </div>
  );
}
