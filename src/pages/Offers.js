// In StationaryPage.js
import CommonPage from './CommonPage';
import { Helmet } from 'react-helmet';
function Offers() {
  return (
    <>
    <Helmet>
    <meta name="description" content="Check out the latest special offers at TheCreativeBud. Grab discounts on your favorite creative products, from stationery to accessories." />
</Helmet>

    <CommonPage databasePath="offers" storagePath="offers-photos" pageTitle="Offers" />
    </>
  );
}

export default Offers;
