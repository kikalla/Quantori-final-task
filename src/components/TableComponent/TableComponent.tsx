import React, { useEffect, useReducer, useState } from "react";
import { List, ListRowRenderer } from "react-virtualized/dist/es/List";
import "./TableComponent.css";
import { Form, NavLink } from "react-router-dom";
import SortHeader from "./SortHeader";

interface DataResults {
  length?: number;
  organism?: {
    scientificName: string;
  };
  genes?: { geneName: { value: string } }[];
  uniProtkbId?: string;
  primaryAccession: string;
  sequence?: { length: number };
  comments?: Comment[];
}

interface Comment {
  commentType: string;
  subcellularLocations: { location: { value: string } }[];
}

interface Data {
  results?: DataResults[];
}

const TableComponent: React.FC = () => {
  const [data, setData] = useState<Data>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initial, setInitial] = useState<boolean>(true);

  const searchHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputValue = (e.currentTarget[0] as HTMLInputElement).value;
    dispatchLink({ type: "SEARCH", value: inputValue });
  };

  const getLinkFromHeader = (headerLink: string): string => {
    const linkStartIndex = headerLink.indexOf("<") + 1;
    const linkEndIndex = headerLink.indexOf(">");
    const link = headerLink.substring(linkStartIndex, linkEndIndex);
    return link;
  };

  interface LinkDispatch {
    type: string;
    value: string;
    dir?: string;
  }

  interface SortDispatch {
    type: string;
    value: string;
    dir?: string;
  }

  interface LinkState {
    search: string;
    link: string;
    sort: string;
    scrollLink: string;
  }

  interface SortState {
    accession: string;
    id: string;
    gene: string;
    organism_name: string;
    length: string;
  }

  const linkReducer = (state: LinkState, action: LinkDispatch) => {
    const sortRegex = /&sort=[\w\s%]*?(asc|desc)/;
    const searchRegex = /search\?&query=\((.*?)\)/;

    switch (action.type) {
      case "SEARCH":
        return {
          ...state,
          search: action.value,
          sort: "",
          link: state.link
            .replace(searchRegex, `search?&query=(${action.value})`)
            .replace(sortRegex, ``),
        };
      case "LINK":
        return {
          ...state,
          link: action.value,
        };
      case "SCROLL-LINK":
        return {
          ...state,
          scrollLink: action.value,
        };
      case "SORT":
        const includesSort = sortRegex.test(state.link);
        if (action.dir === "") {
          return {
            ...state,
            sort: action.value,
            link: state.link.replace(sortRegex, ``),
          };
        } else if (includesSort) {
          return {
            ...state,
            sort: action.value,
            link: state.link.replace(
              sortRegex,
              `&sort=${action.value}%20${action.dir}`
            ),
          };
        } else {
          return {
            ...state,
            sort: action.value,
            link: state.link + `&sort=${action.value}%20${action.dir}`,
          };
        }
      default:
        return state;
    }
  };

  const SortReducer = (state: SortState, action: SortDispatch) => {
    switch (action.type) {
      case "ACCESSION":
        return {
          accession: action.value,
          id: "",
          gene: "",
          organism_name: "",
          length: "",
        };
      case "ID":
        return {
          accession: "",
          id: action.value,
          gene: "",
          organism_name: "",
          length: "",
        };
      case "GENE":
        return {
          accession: "",
          id: "",
          gene: action.value,
          organism_name: "",
          length: "",
        };
      case "ORGANISM_NAME":
        return {
          accession: "",
          id: "",
          gene: "",
          organism_name: action.value,
          length: "",
        };
      case "LENGTH":
        return {
          accession: "",
          id: "",
          gene: "",
          organism_name: "",
          length: action.value,
        };
      default:
        return state;
    }
  };

  const [linkState, dispatchLink] = useReducer(linkReducer, {
    search: "",
    link: `https://rest.uniprot.org/uniprotkb/search?&query=()`,
    sort: "",
    scrollLink: "",
  });

  const [sortState, dispatchSort] = useReducer(SortReducer, {
    accession: "",
    id: "",
    gene: "",
    organism_name: "",
    length: "",
  });

  const fetchData = (searchLink: string, isFirst: boolean) => {
    setIsLoading(true);
    fetch(searchLink)
      .then((response) => {
        const responseData = response.json();
        const nextLink = getLinkFromHeader(response.headers.get("link") || "");
        dispatchLink({ type: "SCROLL-LINK", value: nextLink });
        return responseData;
      })
      .then((responseData) => {
        const newResults = responseData.results;
        if (isFirst) {
          setData({ results: [...newResults] });
        } else {
          setData((prevData) => {
            if (prevData?.results && Array.isArray(prevData.results)) {
              return {
                ...prevData,
                results: [...prevData.results, ...newResults],
              };
            } else {
              return { results: newResults };
            }
          });
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setData({});
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!initial) {
      fetchData(linkState.link, true);
    }
    setInitial(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkState.search, linkState.sort, sortState]);

  const handleScroll = ({ scrollTop, clientHeight, scrollHeight }: any) => {
    const isNearBottom = scrollHeight - scrollTop <= clientHeight * 2;

    if (isNearBottom && !isLoading && linkState.link) {
      fetchData(linkState.scrollLink, false);
    }
  };

  const sortHandler = (sortBy: string) => {
    const directionMap: { [key: string]: string } = {
      id: sortState.id,
      accession: sortState.accession,
      gene: sortState.gene,
      organism_name: sortState.organism_name,
      length: sortState.length,
    };

    let direction = directionMap[sortBy];

    if (direction === "asc") {
      direction = "desc";
    } else if (direction === "desc") {
      direction = "";
    } else {
      direction = "asc";
    }

    dispatchSort({ type: sortBy.toUpperCase(), value: direction });
    dispatchLink({ type: "SORT", value: sortBy, dir: direction });
  };

  const rowRenderer: ListRowRenderer = ({ key, index, style }) => {
    const rowData = data?.results?.[index];
    return (
      <div className="flex table__list" key={key} style={style}>
        <div className=" table__item--index flex">{index + 1}</div>
        <NavLink
          className="table__item table__item--entry flex"
          to={`${rowData?.primaryAccession}/details`}>
          {rowData?.primaryAccession}
        </NavLink>
        <div className="table__item table__item--name flex">
          {rowData?.uniProtkbId}
        </div>
        <div className="table__item table__item--genes flex">
          {rowData?.genes?.map((gene: any, geneIndex: number) => (
            <span className="table__gene" key={geneIndex}>
              {gene?.geneName?.value}
            </span>
          ))}
        </div>
        <div className="table__item flex">
          <span className="table__item--organism">
            {rowData?.organism?.scientificName}
          </span>
        </div>
        <div className="table__item table__item--location flex">
          {
            rowData?.comments?.find(
              (com: Comment) => com.commentType === "SUBCELLULAR LOCATION"
            )?.subcellularLocations?.[0]?.location?.value
          }
        </div>
        <div className="table__item table__item--length flex">
          {rowData?.sequence?.length}
        </div>
      </div>
    );
  };

  return (
    <>
      <Form className="table__form flex" onSubmit={searchHandler}>
        <input
          className="table__form--input"
          disabled={isLoading}
          type="text"
        />
        <button
          className="table__form--button"
          disabled={isLoading}
          type="submit">
          search
        </button>
      </Form>
      <div className="table__sort flex">
        <div className="table__sort--num">#</div>
        <SortHeader
          label="Entry"
          sortKey="accession"
          sortState={sortState}
          sortHandler={sortHandler}
        />
        <SortHeader
          label="Entry Names"
          sortKey="id"
          sortState={sortState}
          sortHandler={sortHandler}
        />
        <SortHeader
          label="Genes"
          sortKey="gene"
          sortState={sortState}
          sortHandler={sortHandler}
        />
        <SortHeader
          label="Organism"
          sortKey="organism_name"
          sortState={sortState}
          sortHandler={sortHandler}
        />
        <div className="table__sort--wrapper flex">
          <p>Subcellular Location</p>
        </div>
        <SortHeader
          label="Length"
          sortKey="length"
          sortState={sortState}
          sortHandler={sortHandler}
        />
      </div>
      {isLoading && <div className="table__loading">Loading</div>}

      {data?.results?.length === 0 || !data?.results?.length ? (
        <div className="table__data">
          <div>No data to display</div>
          <div>Please start search to display results</div>
        </div>
      ) : (
        // @ts-ignore
        <List
          className="table"
          height={700}
          rowCount={data?.results?.length || 0}
          rowHeight={60}
          rowRenderer={rowRenderer}
          onScroll={handleScroll}
          width={2000}
        />
      )}
    </>
  );
};

export default TableComponent;
