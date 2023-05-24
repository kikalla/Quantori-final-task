import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./ProteinPublications.css";
import LinkIcon from "../../assets/LinkIcon";

interface Publication {
  citation: {
    id: string;
    title: string;
    authors: string[];
    citationCrossReferences?: {
      database: string;
      id: string;
    }[];
    publicationDate: string;
    journal: string;
    firstPage: string;
    lastPage: string;
    volume: string;
  };
  references?: {
    sourceCategories: string[];
    referencePositions: string[];
    source?: {
      name: string;
    };
  }[];
}

const ProteinPublications: React.FC = () => {
  const { id } = useParams();
  const [publications, setPublications] = useState<Publication[]>([]);

  useEffect(() => {
    fetch(`https://rest.uniprot.org/uniprotkb/${id}/publications`)
      .then((response) => response.json())
      .then((data) => {
        setPublications(data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  return (
    <div className="protein__publications flex">
      {publications.map((pub) => {
        return (
          <div key={pub.citation.id} className="protein__publication flex">
            <h2 className="protein__publication--title">
              {pub.citation?.title}
            </h2>
            <div className="publication__authors">
              {pub?.citation?.authors?.map((aut: any, geneIndex: number) => (
                <span
                  className="publication__infos publication__author"
                  key={geneIndex}>
                  {aut + " "}
                </span>
              ))}
            </div>
            <div>
              <span className="protein__publications--pharagraph">
                Categories:&nbsp;
              </span>
              <span>
                {pub?.references?.map((refer: any, geneIndex: number) => (
                  <span className="publication__infos" key={geneIndex}>
                    {refer.sourceCategories}
                  </span>
                ))}
              </span>
            </div>
            <div>
              <span className="protein__publications--pharagraph">
                Cited for:&nbsp;
              </span>
              <span>
                {pub?.references?.map((refer: any, geneIndex: number) => (
                  <span className="publication__infos" key={geneIndex}>
                    {refer.referencePositions}
                  </span>
                ))}
              </span>
            </div>
            <div>
              <span className="protein__publications--pharagraph">
                Source:&nbsp;
              </span>
              <span>
                {pub?.references?.map((refer: any, geneIndex: number) => (
                  <span className="publication__infos" key={geneIndex}>
                    {refer.source.name}
                  </span>
                ))}
              </span>
            </div>
            {pub.citation?.citationCrossReferences && (
              <div className="flex protein__publications--links">
                <NavLink
                  target="_blank"
                  className={"protein__publications--link flex"}
                  to={`https://pubmed.ncbi.nlm.nih.gov/${pub?.citation?.citationCrossReferences[0]?.id}/`}>
                  PubMed <LinkIcon />
                </NavLink>
                <NavLink
                  target="_blank"
                  className={"protein__publications--link flex"}
                  to={`https://europepmc.org/article/MED/${pub?.citation?.citationCrossReferences[0]?.id}/`}>
                  Europe PMC <LinkIcon />
                </NavLink>
                {pub.citation?.citationCrossReferences[1]?.id ? (
                  <NavLink
                    target="_blank"
                    className={"protein__publications--link flex"}
                    to={`https://dx.doi.org/${pub?.citation?.citationCrossReferences[1]?.id}`}>
                    {pub.citation.journal +
                      " " +
                      pub.citation.volume +
                      ": " +
                      pub.citation.firstPage +
                      "-" +
                      pub.citation.lastPage +
                      " (" +
                      pub.citation.publicationDate +
                      ")"}
                    <LinkIcon />
                  </NavLink>
                ) : (
                  <div
                    className={
                      "protein__publications--link flex disabled__link"
                    }>
                    {pub?.citation?.journal +
                      " " +
                      pub?.citation?.volume +
                      ": " +
                      pub?.citation?.firstPage +
                      "-" +
                      pub?.citation?.lastPage +
                      " (" +
                      pub?.citation?.publicationDate +
                      ")"}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProteinPublications;
