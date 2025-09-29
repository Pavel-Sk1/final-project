import { getAllPartnersThunk } from "@/entities";
import styles from "./AdminPartnerList.module.css";
import { useAppDispatch, useAppSelector } from "@/shared";
import { AdminPartnerForm } from "@/widgets/adminPartnerForm";
import { useEffect, useState } from "react";
import { AdminPartnerCard } from "@/widgets/adminPartnerCard";

export function AdminPartnerList() {
  const dispatch = useAppDispatch();
  const { partnersArray } = useAppSelector((state) => state.partner);
  const [editOnePartner, setEditOnePartner] = useState(false);
  const [editOnePartnerId, setEditOnePartnerId] = useState(0);

  useEffect(() => {
    try {
      dispatch(getAllPartnersThunk());
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  return (
    <div className={styles.itemsContainer}>
      {partnersArray.map((partner) =>
        editOnePartner && editOnePartnerId === partner.id ? (
          <AdminPartnerForm
            key={partner.id}
            partner={partner}
            setEditOnePartner={setEditOnePartner}
            setCreatePartner={null}
          />
        ) : (
          <AdminPartnerCard
            key={partner.id}
            partner={partner}
            setEditOnePartner={setEditOnePartner}
            setEditOnePartnerId={setEditOnePartnerId}
          />
        )
      )}
    </div>
  );
}
