// In StationaryPage.js
import CommonPage from './CommonPage';
import { Helmet } from 'react-helmet';
function Pendants() {
  return (
    <>
    <Helmet>
    <meta name="description" content="Explore a variety of pendant designs at TheCreativeBud. Our handcrafted pendants are perfect for adding a personal touch to your jewelry collection." />
</Helmet>
<CommonPage databasePath="pendants" storagePath="pendants-photos" pageTitle="Pendants" />
    </>
  );
}

export default Pendants;
