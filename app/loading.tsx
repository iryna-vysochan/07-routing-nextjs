import css from './Home.module.css';

const Loading = () => {
  return (
    <div className={css.container}>
      <p className={css.content}>Loading, please wait...</p>
    </div>
  );
};

export default Loading;