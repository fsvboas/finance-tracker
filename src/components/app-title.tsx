import Column from "./core/column";

const AppTitle = () => {
  return (
    <Column className="w-fit items-end">
      <h1 className="text-4xl md:text-5xl font-bold text-green-600">
        Finance Tracker
      </h1>
      <span className="text-xs">~ainda to pensando em um nome</span>
    </Column>
  );
};

export default AppTitle;
