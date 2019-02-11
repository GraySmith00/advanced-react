import PleaseSignIn from '../components/PleaseSignIn';
import Permissions from '../components/Permissions';

const permissionsPage = props => {
  return (
    <div>
      <PleaseSignIn>
        <Permissions />
      </PleaseSignIn>
    </div>
  );
};

export default permissionsPage;
