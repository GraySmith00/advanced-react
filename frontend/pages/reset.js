import Reset from '../components/Reset';

const reset = ({ query }) => {
  return (
    <div>
      <p>Reset Your Password</p>
      <Reset resetToken={query.resetToken} />
    </div>
  );
};

export default reset;
