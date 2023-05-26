import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import "./ProteinComponent.css";
import { Protein, Feature } from "../../models/Protein";

const ProteinComponent: React.FC = () => {
  const [protein, setProtein] = useState<Protein>({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://rest.uniprot.org/uniprotkb/${id}`)
      .then((response) => {
        if (!response.ok) {
          navigate("/error");
        }
        return response.json();
      })
      .then((data) => {
        setProtein(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, navigate]);
  return (
    <div className="protein flex">
      <div className="protein__des--header flex">
        <h1 className="protein__des--title">
          {protein.primaryAccession} / {protein.uniProtkbId}
        </h1>
        <div className="protein__des--name">
          {protein.organism?.scientificName}
        </div>
      </div>
      <div className="protein__des--body flex">
        <div className="protein__des--protein flex">
          <p className="des__protein--title">Protein</p>
          <p>
            {
              protein.features?.find((fet: Feature) => fet.type === "Chain")
                ?.description
            }
          </p>
        </div>
        <div className="protein__des--gene flex">
          <p className="des__gene--title">Gene</p>
          <p>
            {protein?.genes?.map((gene: any, geneIndex: number) => (
              <span className="table__gene" key={geneIndex}>
                {gene?.geneName?.value}.
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="protein__options flex">
        <NavLink
          to={"details"}
          className={({ isActive }) =>
            `protein__option ${isActive ? "active__link" : ""}`
          }>
          Details
        </NavLink>
        <NavLink
          to={"feature"}
          className={({ isActive }) =>
            `protein__option ${isActive ? "active__link" : ""}`
          }>
          Feature viewer
        </NavLink>
        <NavLink
          to="publications"
          className={({ isActive }) =>
            `protein__option ${isActive ? "active__link" : ""}`
          }>
          Publications
        </NavLink>
      </div>
      <Outlet context={protein} />
    </div>
  );
};

export default ProteinComponent;
