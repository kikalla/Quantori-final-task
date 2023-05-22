import React, { useEffect, useState } from "react";
import { List, ListRowRenderer } from "react-virtualized/dist/es/List";
import "./TableComponent.css";
import { Form } from "react-router-dom";



interface gio{
  length?: number
  organism? : {
    scientificName: string
  }
  genes?: {geneName: {value:string}}[]
  uniProtkbId?: string
  primaryAccession: string
  sequence?: {length: number}
  comments? : comment[]
}

interface comment {
  commentType: string;
  subcellularLocations: { location: { value: string } }[];
}

interface Data {
  results?: gio[];
}

const MyComponent: React.FC = () => {
  const [data, setData] = useState<Data>({});
  const [search, setSearch] = useState<string>("");
  const [link, setLink] = useState<string>(
    `https://rest.uniprot.org/uniprotkb/search?&query=(${search})&size=30`
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initial, setInitial] = useState<boolean>(true);

  const searchHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputValue = (e.currentTarget[0] as HTMLInputElement).value;
    setSearch(inputValue);
  };

  const getLinkFromHeader = (headerLink: string): string => {
    const linkStartIndex = headerLink.indexOf("<") + 1;
    const linkEndIndex = headerLink.indexOf(">");
    const link = headerLink.substring(linkStartIndex, linkEndIndex);
    return link;
  };

  const fetchData = (searchLink: string, isFirst: boolean) => {
    setIsLoading(true);
    fetch(searchLink)
      .then((response) => {
        const responseData = response.json();
        const nextLink = getLinkFromHeader(response.headers.get("link") || "");
        setLink(nextLink);
        return responseData;
      })
      .then((responseData) => {
        const newResults = responseData.results;
        if (isFirst) {
          setData({ results: [...newResults] });
        } else {
          setData(prevData => {
            if (prevData?.results && Array.isArray(prevData.results)) {
              return { ...prevData, results: [...prevData.results, ...newResults] };
            } else {
              return { results: newResults };
            }
          });        }
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
      fetchData(
        `https://rest.uniprot.org/uniprotkb/search?&query=(${search})&size=30`,
        true
      );
    }
    setInitial(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleScroll = ({ scrollTop, clientHeight, scrollHeight }: any) => {
    const isNearBottom = scrollHeight - scrollTop <= clientHeight * 2;

    if (isNearBottom && !isLoading && link) {
      fetchData(link, false);
    }
  };

  const rowRenderer: ListRowRenderer = ({ key, index, style }) => {
    const rowData = data?.results?.[index];
    return (
      <div className="flex table__list" key={key} style={style}>
        <div className="table__item table__item--entry flex">
          {rowData?.primaryAccession}
        </div>
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
              (com: comment) => com.commentType === "SUBCELLULAR LOCATION"
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
          type="submit"
        >
          search
        </button>
      </Form>

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
      {isLoading && <div>Loading</div>}
    </>
  );
};

export default MyComponent;