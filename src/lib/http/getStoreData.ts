import axios from "axios";

const getStoreData = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/store/storeInformation/${id}`)
        .then((res) => {
          if (res.data.storeInformation) {
            // document.cookie = `storeData=${encodeURIComponent(
            //   JSON.stringify(res.data.storeInformation)
            // )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days

            document.cookie = `storeData=${true}; path=/; max-age=${
              60 * 60 * 24 * 365
            }`;

            localStorage.setItem(
              "storeData",
              JSON.stringify(res.data.storeInformation)
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });

      await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/store/businessInformation/${id}`
        )
        .then((res) => {
          if (res.data.businessInformation) {
            // document.cookie = `businessInformation=${encodeURIComponent(
            //   JSON.stringify(res.data.businessInformation)
            // )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
            document.cookie = `businessInformation=${true}; path=/; max-age=${
              60 * 60 * 24 * 365
            }`;
            localStorage.setItem(
              "businessInformation",
              JSON.stringify(res.data.businessInformation)
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });

      await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/store/paymentInformation/${id}`
        )
        .then((res) => {
          if (res.data.paymentInformation) {
            // document.cookie = `paymentInformation=${encodeURIComponent(
            //   JSON.stringify(res.data.paymentInformation)
            // )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
            document.cookie = `paymentInformation=${true}; path=/; max-age=${
              60 * 60 * 24 * 365
            }`;
            localStorage.setItem(
              "paymentInformation",
              JSON.stringify(res.data.paymentInformation)
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });

      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/${id}`)
        .then((res) => {
          if (res.data.subscription) {
            // document.cookie = `subscription=${encodeURIComponent(
            //   JSON.stringify(res.data.subscription)
            // )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
            document.cookie = `subscription=${true}; path=/; max-age=${
              60 * 60 * 24 * 365
            }`;
            localStorage.setItem(
              "subscription",
              JSON.stringify(res.data.subscription)
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });

      resolve(true);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export { getStoreData };
