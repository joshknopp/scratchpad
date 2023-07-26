-- Create the table (if not exists) where the trigger will be applied
CREATE TABLE YourTableName (
    ID INT PRIMARY KEY,
    [key] VARCHAR(50),
    name VARCHAR(100)
);

-- Create the trigger
CREATE TRIGGER trg_InsteadOfInsert
ON YourTableName
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the inserted key already exists in the table
    IF EXISTS (
        SELECT 1
        FROM YourTableName AS t
        INNER JOIN inserted AS i ON t.[key] = i.[key]
    )
    BEGIN
        -- Update the existing record with the new values from the INSERTED table
        UPDATE t
        SET t.name = i.name
        FROM YourTableName AS t
        INNER JOIN inserted AS i ON t.[key] = i.[key];
    END
    ELSE
    BEGIN
        -- If the key doesn't exist, proceed with the INSERT operation
        INSERT INTO YourTableName (ID, [key], name)
        SELECT ID, [key], name
        FROM inserted;
    END
END;
