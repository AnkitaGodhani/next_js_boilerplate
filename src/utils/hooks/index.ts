export const rgbaWithOpacity = (color: string, opacity: number) => {
  color = color.replace("#", "");

  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const filterSearchData = (
  titleField: string,
  search: string,
  data: any
) => {
  if (!data || !search) return;
  const searchTermLowerCase = search.toLowerCase();
  switch (titleField) {
    case "stockList":
      return data?.filter((item: any) => {
        const patternNumberMatch = item?.patternId?.patternNumber
          ?.toLowerCase()
          .includes(searchTermLowerCase);
        const pieceMatch = item?.pieces
          ?.toString()
          ?.toLowerCase()
          .includes(searchTermLowerCase);
        return patternNumberMatch || pieceMatch;
      });
    case "jobList":
      return data?.filter((item: any) => {
        const pharmaNumberMatch = item?.pharmaNumber
          ?.toLowerCase()
          .includes(searchTermLowerCase);
        return pharmaNumberMatch;
      });
    case "userList":
      return data?.filter((item: any) => {
        const fullName = `${item?.firstName} ${item?.lastName}`;
        const fullNameMatch = fullName
          ?.toLowerCase()
          ?.includes(searchTermLowerCase);
          const roleMatch = item?.userId?.role
          ?.toLowerCase()
          ?.includes(searchTermLowerCase);
        return fullNameMatch || roleMatch;
      });
    case "vendorList":
      return data?.filter((item: any) => {
        const nameMatch = item?.name
          ?.toLowerCase()
          ?.includes(searchTermLowerCase);
        return nameMatch;
      });
    default:
      return data;
  }
};
