import axios from "axios";

const getStoreData = (id: string) => {
  axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/store/storeInformation/${id}`)
    .then((res) => {
      if (res.data.storeInformation) {
        document.cookie = `storeData=${JSON.stringify(
          res.data.storeInformation
        )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
      }
    })
    .catch((err) => {
      console.log(err);
    });

  axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/store/businessInformation/${id}`)
    .then((res) => {
      if (res.data.businessInformation) {
        document.cookie = `businessInformation=${JSON.stringify(
          res.data.businessInformation
        )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
      }
    })
    .catch((err) => {
      console.log(err);
    });

  axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/store/paymentInformation/${id}`)
    .then((res) => {
      if (res.data.paymentInformation) {
        document.cookie = `paymentInformation=${JSON.stringify(
          res.data.paymentInformation
        )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
      }
    })
    .catch((err) => {
      console.log(err);
    });

  axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/${id}`)
    .then((res) => {
      if (res.data.subscription) {
        document.cookie = `subscription=${JSON.stringify(
          res.data.subscription
        )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export { getStoreData };
