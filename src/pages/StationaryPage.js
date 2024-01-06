// In StationaryPage.js
import CommonPage from './CommonPage';
import '../styling/stattionary.css'
import { Helmet } from 'react-helmet';
function StationaryPage() {
  return (
    <>
    <Helmet>
    <meta name="description" content="Browse our exclusive selection of stationery at TheCreativeBud. Find beautifully crafted notebooks, pens, and accessories to inspire your creativity." />
</Helmet>
<CommonPage databasePath="stationary" storagePath="stationary-photos" pageTitle="Stationary" />
</>
  );
}

export default StationaryPage;
