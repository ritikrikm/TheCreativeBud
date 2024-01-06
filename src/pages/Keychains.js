// In StationaryPage.js
import CommonPage from './CommonPage';
import { Helmet } from 'react-helmet';
function Keychains() {
  return(
    <>
<Helmet>
    <meta name="description" content="Find unique and creative keychains at TheCreativeBud. Our collection ranges from stylish to functional designs, perfect for your keys or as a gift." />
</Helmet>

<CommonPage databasePath="keychains" storagePath="keychains-photos" pageTitle="Keychains" />
    </>
  );
}

export default Keychains;
