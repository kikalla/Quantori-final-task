import ProtvistaUniprot from "protvista-uniprot";
import "./ProteinFeature.css";
import { useParams } from "react-router-dom";
window.customElements.define("protvista-uniprot", ProtvistaUniprot);

const ProteinFeature = () => {
  const { id } = useParams();

  return <protvista-uniprot class="protein__feature" accession={id} />;
};

export default ProteinFeature;
