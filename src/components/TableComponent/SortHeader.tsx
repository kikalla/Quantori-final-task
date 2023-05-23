import SortIcon from "../../assets/SortIcon";

interface Props {
  label: string;
  sortKey: string;
  sortState: any;
  sortHandler: (sortKey: string) => void;
}

const SortHeader: React.FC<Props> = ({
  label,
  sortKey,
  sortState,
  sortHandler,
}) => {
  const isActive = sortState[sortKey] !== "";
  const isSelected = isActive ? true : false;

  return (
    <div className="table__sort--wrapper flex">
      <p>{label}</p>
      <span
        className={`${isActive ? "active" : ""} flex sort__icon`}
        onClick={sortHandler.bind(null, sortKey)}>
        <SortIcon isSelected={isSelected} />
      </span>
    </div>
  );
};

export default SortHeader;
