import CopyIcon from "../../assets/CopyIcon";
import { Protein } from "../../models/Protein";
import "./ProteinDetails.css";
import { useOutletContext } from "react-router-dom";

const ProteinDetails: React.FC = () => {
  const copyHandler = () => {
    navigator.clipboard.writeText(protein.sequence?.value || "");
  };
  const protein = useOutletContext<Protein>();

  return (
    <div className="protein__details flex">
      <h1 className="protein__details--title">Sequence</h1>
      <div className="protein__details--body">
        <div className="protein__details--wrapper flex">
          <p className="protein__details--pharagraph">Length</p>
          <p>{protein.sequence?.length}</p>
        </div>
        <div className="protein__details--wrapper flex">
          <p className="protein__details--pharagraph">Last updated</p>
          <p>
            {protein.entryAudit?.lastSequenceUpdateDate
              ? new Date(
                  protein.entryAudit.lastSequenceUpdateDate
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </p>
        </div>

        <div className="protein__details--wrapper flex">
          <p className="protein__details--pharagraph">Mass (Da)</p>
          <p>{protein.sequence?.molWeight.toLocaleString()}</p>
        </div>
        <div className="protein__details--wrapper flex">
          <p className="protein__details--pharagraph">Checksum</p>
          <p>{protein.sequence?.crc64}</p>
        </div>
      </div>
      <div className="protein__details--code">
        <div className="ptorein__details--copy flex" onClick={copyHandler}>
          <CopyIcon />
          Copy
        </div>
        {protein.sequence?.value}
      </div>
    </div>
  );
};

export default ProteinDetails;
