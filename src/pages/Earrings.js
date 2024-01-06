// In StationaryPage.js
import CommonPage from './CommonPage';
import { Helmet } from 'react-helmet';
function Earrings() {
  return (
    <>
    <Helmet>
    <meta name="description" content="Discover our exclusive collection of earrings at TheCreativeBud. From elegant designs to creative styles, find the perfect earrings to complement your look." />
</Helmet>
<CommonPage databasePath="earrings" storagePath="earrings-photos" pageTitle="Earrings" />

    </>
  );
}

export default Earrings;
