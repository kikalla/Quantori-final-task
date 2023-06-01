import {
  ChangeEvent,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import "./TableFilter.css";

interface Props {
  filtersValues: {
    gene: string;
    organism: string;
    lengthFrom: string;
    lengthTo: string;
    annotation: string;
    protein: string;
  };
  dispatch: Function;
  organisms: {
    label: string;
    value: number;
  }[];
  annotations: {
    value: number;
  }[];
  toggleFilter: Function;
}

const TableFilter: React.FC<Props> = (props) => {
  const dispatch = props.dispatch;

  const [isValid, setIsValid] = useState(false);
  const [gene, setGene] = useState(props.filtersValues.gene);
  const [selectedOrganism, setSelectedOrganism] = useState(
    props.filtersValues.organism
  );
  const [selectedAnnotation, setSelectedAnnotation] = useState(
    props.filtersValues.annotation
  );
  const [selectedProteinWith, setSelectedProteinWith] = useState(
    props.filtersValues.protein
  );
  const [sequenceLengthFrom, setSequenceLengthFrom] = useState(
    props.filtersValues.lengthFrom
  );
  const [sequenceLengthTo, setSequenceLengthTo] = useState(
    props.filtersValues.lengthTo
  );

  useEffect(() => {
    if (
      (gene ||
        selectedOrganism ||
        selectedAnnotation ||
        selectedProteinWith ||
        (sequenceLengthFrom && sequenceLengthTo)) &&
      ((sequenceLengthFrom && sequenceLengthTo) ||
        (!sequenceLengthFrom && !sequenceLengthTo))
    ) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [
    gene,
    selectedAnnotation,
    selectedOrganism,
    selectedProteinWith,
    sequenceLengthFrom,
    sequenceLengthTo,
  ]);

  const geneHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setGene(e.target.value);
  };

  const organismChangeHandler = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedOrganism(e.target.value);
  };

  const annotationChangeHandler = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedAnnotation(e.target.value);
  };

  const ProteinChangeHandler = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedProteinWith(e.target.value);
  };

  const sequenceLengthFromHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSequenceLengthFrom(e.target.value);
  };
  const sequenceLengthToHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSequenceLengthTo(e.target.value);
  };

  const closeHandler = () => {
    props.toggleFilter();
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let dataString = "";
    const filtersObj = {
      gene: gene,
      organism: selectedOrganism,
      lengthFrom: sequenceLengthFrom,
      lengthTo: sequenceLengthTo,
      annotation: selectedAnnotation,
      protein: selectedProteinWith,
    };
    if (gene) {
      dataString = dataString + ` AND (gene:${gene})`;
    }
    if (selectedOrganism) {
      dataString = dataString + ` AND (model_organism:${selectedOrganism})`;
    }
    if (sequenceLengthFrom && sequenceLengthTo) {
      dataString =
        dataString +
        ` AND length:%5B${sequenceLengthFrom}%20TO%20${sequenceLengthTo}%5D`;
    }
    if (selectedAnnotation) {
      dataString = dataString + ` AND (annotation_score:${selectedAnnotation})`;
    }
    if (selectedProteinWith) {
      dataString = dataString + ` AND (proteins_with:${selectedProteinWith})`;
    }
    dispatch({ type: "FILTERS-STRING", value: dataString });
    dispatch({ type: "FILTERS", value: filtersObj });
    props.toggleFilter();
  };
  return (
    <>
      <div className="filters__wrapper" onClick={closeHandler}></div>
      <form onSubmit={submitHandler} className="filter__form flex">
        <h2>Filters</h2>
        <div>
          <label className="form__gene--label" htmlFor="gene">
            Gene Name
          </label>
          <input
            value={gene}
            onChange={geneHandler}
            type="text"
            id="gene"
            placeholder="Enter Gene Name"
            className="filter__input"
          />
        </div>
        <div className="form__organism">
          <label htmlFor="organism" className="form__organism--label">
            Organism
          </label>
          <select
            id="organism"
            value={selectedOrganism}
            onChange={organismChangeHandler}
            className="form__organism--select">
            <option value="">Select an option</option>
            {props?.organisms?.map((org) => {
              return (
                <option key={org.value} value={org.value}>
                  {org.label}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form__length ">
          <label className="form__length--label" htmlFor="length">
            Sequence length
          </label>
          <div className="flex">
            <input
              value={sequenceLengthFrom}
              onChange={sequenceLengthFromHandler}
              type="number"
              placeholder="From"
              className="filter__input"
            />
            <div className="form__length--line"></div>
            <input
              value={sequenceLengthTo}
              onChange={sequenceLengthToHandler}
              type="number"
              placeholder="To"
              className="filter__input"
            />
          </div>
        </div>
        <div className="form__annotation">
          <label htmlFor="annotation" className="form__annotation--label">
            Annotation score
          </label>
          <select
            id="annotation"
            value={selectedAnnotation}
            onChange={annotationChangeHandler}
            className="form__annotation--select">
            <option value="">Select an option</option>
            {props?.annotations?.map((ann) => {
              return (
                <option key={ann.value} value={ann.value}>
                  {ann.value}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form__protein">
          <label htmlFor="protein" className="form__protein--label">
            Protein with
          </label>
          <select
            id="protein"
            value={selectedProteinWith}
            onChange={ProteinChangeHandler}
            className="form__protein--select">
            <option value="">Select</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div className="flex">
          <button
            onClick={closeHandler}
            className="form__button form__button--cancel">
            Cancel
          </button>
          <button
            disabled={!isValid}
            type="submit"
            className={`${
              isValid && "active__button"
            } form__button form__button--apply`}>
            Apply Filters
          </button>
        </div>
      </form>
    </>
  );
};

export default TableFilter;
