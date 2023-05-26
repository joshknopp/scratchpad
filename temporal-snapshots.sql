SELECT *
FROM (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY CONVERT(DATE, ValidFrom) ORDER BY ValidFrom DESC) AS RowNum
  FROM YourTemporalTable
  WHERE ValidFrom >= DATEADD(DAY, -6, CONVERT(DATE, GETDATE()))
    AND ValidFrom <= CONVERT(DATETIME, CONVERT(DATE, GETDATE())) -- Replace with your desired time
) AS T
WHERE RowNum = 1
ORDER BY ValidFrom;
