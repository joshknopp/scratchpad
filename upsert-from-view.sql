-- Select data from the view
DECLARE @Type NVARCHAR(50), @Name NVARCHAR(50), @Result BIT;

DECLARE data_cursor CURSOR FOR
SELECT [TYPE], [NAME], [RESULT]
FROM YourView;

OPEN data_cursor;
FETCH NEXT FROM data_cursor INTO @Type, @Name, @Result;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Check if the record already exists in the table
    IF EXISTS (SELECT 1 FROM YourTable WHERE [TYPE] = @Type AND [NAME] = @Name)
    BEGIN
        -- Update the existing record
        UPDATE YourTable
        SET [RESULT] = @Result
        WHERE [TYPE] = @Type AND [NAME] = @Name;
    END
    ELSE
    BEGIN
        -- Insert a new record
        INSERT INTO YourTable ([TYPE], [NAME], [RESULT])
        VALUES (@Type, @Name, @Result);
    END

    FETCH NEXT FROM data_cursor INTO @Type, @Name, @Result;
END

CLOSE data_cursor;
DEALLOCATE data_cursor;
