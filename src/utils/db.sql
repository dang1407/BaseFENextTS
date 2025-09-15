CREATE OR REPLACE PROCEDURE NCB_FLEXCASH_DEV.SP_NCB_ECM_GET_UPLOAD_INFO
(
    C_REF_ID IN NUMBER,
    C_REF_TYPE IN NUMBER,
    C_TABLE_RESULT OUT SYS_REFCURSOR
)
AS
    v_table_name VARCHAR2(100);
    v_transaction_code VARCHAR2(100);
    v_branch_code_col_name VARCHAR2(100);
    v_branch_name_col_name VARCHAR2(100);
    v_user_accounting_col_name VARCHAR2(100);
    v_date VARCHAR2(50); -- Định dạng ngày
    v_ref_id_col_name VARCHAR2(100);
    v_sql VARCHAR2(4000);
BEGIN
    -- Xác định bảng và cột dựa trên REF_TYPE
    IF C_REF_TYPE = 20 THEN
        v_table_name := 'FTR_TRANSACTION_CASH_IN';
        v_transaction_code := 'TRANSACTION_CODE';
        v_ref_id_col_name := 'TRANSACTION_ID';
        v_branch_code_col_name := 'BRANCH_CODE';
        v_branch_name_col_name := 'BRANCH_NAME';
        v_user_accounting_col_name := 'USER_ACCOUNTING';
        v_date := 'TO_CHAR(SYSDATE, ''YYYY-MM-DD HH24:MI:SS'')'; -- Ví dụ
    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'REF_TYPE không hợp lệ');
    END IF;

    -- Tạo câu SQL động
    v_sql := 'SELECT ' || v_transaction_code || ' AS TRANSACTION_CODE, '
                      || v_branch_code_col_name || ' AS BRANCH_CODE, '
                      || v_branch_name_col_name || ' AS BRANCH_NAME, '
                      || v_user_accounting_col_name || ' AS USER_ACCOUNTING, '
                      || v_date || ' AS DATE '
              || ' FROM ' || v_table_name
              || ' WHERE ' || v_ref_id_col_name || ' = :C_REF_ID';

    -- In câu SQL ra kiểm tra
    DBMS_OUTPUT.PUT_LINE('Generated SQL: ' || v_sql);

    -- Mở con trỏ với bind variable
    OPEN C_TABLE_RESULT FOR v_sql USING C_REF_ID;
END;


		 -- Lấy tồn quỹ kho ĐVKD
         (SELECT
            enFund.CODE AS FUND_CODE
            ,enFund.NAME AS FUND_NAME
            ,CASE
              WHEN enFund.TYPE = 1 THEN 9998
              WHEN enFund.TYPE = 2 THEN 9999
              ELSE NULL
            END AS CODE
            ,enAccountType.VALUE AS ACCOUNT_TYPE
            ,enCurrency.DISPLAY_ORDER
            ,enCurrency.CODE AS CURRENCY_CODE
            ,SUM(enRemain.TOTAL_AMOUNT) AS TOTAL_AMOUNT
            ,enThreshHold.MAX_REMAIN_AMOUNT
            ,CASE
              WHEN enThreshHold.MAX_REMAIN_AMOUNT IS NOT NULL THEN (CASE 
                                                              WHEN SUM(enRemain.TOTAL_AMOUNT) - enThreshHold.MAX_REMAIN_AMOUNT > 0 THEN SUM(enRemain.TOTAL_AMOUNT) - enThreshHold.MAX_REMAIN_AMOUNT
                                                              ELSE NULL
                                                            END)
              ELSE NULL
            END AS OVER_AMOUNT
          FROM
            RPT_MONEY_REMAIN enRemain
          INNER JOIN COM_FUND enFund
            ON enRemain.FUND_ID = enFund.FUND_ID
            AND enFund.TYPE IN (1,2) -- Kho, ĐVKD
            AND enFund.DELETED = 0
          LEFT JOIN COM_CURRENCY enCurrency
            ON enRemain.CURRENCY_CODE = enCurrency.CODE
            AND enCurrency.DELETED = 0
          LEFT JOIN SMX_ACCOUNT_TYPE enAccountType
            ON enRemain.ACCOUNT_TYPE_ID = enAccountType.KEY
          LEFT JOIN (SELECT
                      MAX(EFFECTIVE_DATE) AS EFFECTIVE_DATE
                      ,FUND_ID
                      ,CURRENCY_ID
                    FROM 
                      RPT_FUND_THRESHOLD
                    WHERE
                      EFFECTIVE_DATE < :ReportDTG
                    GROUP BY
                      FUND_ID, CURRENCY_ID
                    ) enGroup
            ON enRemain.FUND_ID = enGroup.FUND_ID
            AND enCurrency.CURRENCY_ID = enGroup.CURRENCY_ID
          LEFT JOIN RPT_FUND_THRESHOLD enThreshHold
            ON enRemain.FUND_ID = enThreshHold.FUND_ID
            AND enCurrency.CURRENCY_ID = enThreshHold.CURRENCY_ID
            AND enGroup.EFFECTIVE_DATE = enThreshHold.EFFECTIVE_DATE
            AND enRemain.ACCOUNT_TYPE_ID = 1
            AND enThreshHold.FUND_TYPE = 2
          WHERE
            enRemain.BUSINESS_DATE = TO_NUMBER(TO_CHAR(:ReportDTG, 'YYYYMMDD'))
			AND :ExportTill IS NULL
            AND (',' || :FundID || ',' LIKE '%,' || enRemain.FUND_ID || ',%')
            AND (:CurrencyID IS NULL OR ',' || :CurrencyID || ',' LIKE '%,' || enCurrency.CURRENCY_ID || ',%')
            AND (:AccountType IS NULL OR ',' || :AccountType || ',' LIKE '%,' || enRemain.ACCOUNT_TYPE_ID  || ',%')
          GROUP BY
            enFund.TYPE, enFund.CODE, enFund.NAME, enAccountType.VALUE, enCurrency.DISPLAY_ORDER, enCurrency.CODE, enThreshHold.MAX_REMAIN_AMOUNT)
    -- Lấy tồn quỹ Kho, ĐVKD tài khoản tiền đang vận chuyển
	UNION 
        (SELECT
            enFund.CODE AS FUND_CODE
            ,enFund.NAME AS FUND_NAME
            ,CASE
              WHEN enFund.TYPE = 1 THEN 9998
              WHEN enFund.TYPE = 2 THEN 9999
              ELSE NULL
            END AS CODE
            ,'TK tiền đang vận chuyển' AS ACCOUNT_TYPE
            ,enCurrency.DISPLAY_ORDER
            ,enCurrency.CODE AS CURRENCY_CODE
            ,SUM(enRemain.BALANCE) AS TOTAL_AMOUNT
            ,enThreshHold.MAX_REMAIN_AMOUNT
            ,CASE
              WHEN enThreshHold.MAX_REMAIN_AMOUNT IS NOT NULL THEN (CASE 
                                                              WHEN SUM(enRemain.BALANCE) - enThreshHold.MAX_REMAIN_AMOUNT > 0 THEN SUM(enRemain.BALANCE) - enThreshHold.MAX_REMAIN_AMOUNT
                                                              ELSE NULL
                                                            END)
              ELSE NULL
            END AS OVER_AMOUNT
          FROM
            RPT_ACCOUNT_HISTORY enRemain
          INNER JOIN COM_FUND enFund
            ON enRemain.FUND_ID = enFund.FUND_ID
            AND enFund.TYPE IN (1,2) -- Kho ĐVKD
            AND enFund.DELETED = 0
          LEFT JOIN COM_CURRENCY enCurrency
            ON enRemain.CURRENCY_CODE = enCurrency.CODE
            AND enCurrency.DELETED = 0
          LEFT JOIN (SELECT
                      MAX(EFFECTIVE_DATE) AS EFFECTIVE_DATE
                      ,FUND_ID
                      ,CURRENCY_ID
                    FROM 
                      RPT_FUND_THRESHOLD
                    WHERE
                      EFFECTIVE_DATE < :ReportDTG
                    GROUP BY
                      FUND_ID, CURRENCY_ID
                    ) enGroup
            ON enRemain.FUND_ID = enGroup.FUND_ID
            AND enCurrency.CURRENCY_ID = enGroup.CURRENCY_ID
          LEFT JOIN RPT_FUND_THRESHOLD enThreshHold
            ON enRemain.FUND_ID = enThreshHold.FUND_ID
            AND enCurrency.CURRENCY_ID = enThreshHold.CURRENCY_ID
            AND enGroup.EFFECTIVE_DATE = enThreshHold.EFFECTIVE_DATE
            AND enRemain.ACCOUNT_TYPE_ID = 1
            AND enThreshHold.FUND_TYPE = 2
          WHERE
            enRemain.BUSINESS_DATE = TO_NUMBER(TO_CHAR(:ReportDTG, 'YYYYMMDD'))
			AND :ExportTill IS NULL
            AND (',' || :FundID || ',' LIKE '%,' || enRemain.FUND_ID || ',%')
            AND (:CurrencyID IS NULL OR ',' || :CurrencyID || ',' LIKE '%,' || enCurrency.CURRENCY_ID || ',%')
            AND (:AccountType IS NULL OR ',' || :AccountType || ',' LIKE '%,' || enRemain.ACCOUNT_TYPE_ID  || ',%')
            AND enRemain.ACCOUNT_TYPE_ID = 7
            GROUP BY
  enFund.TYPE, enFund.CODE, enFund.NAME, enCurrency.DISPLAY_ORDER, enCurrency.CODE, 
enThreshHold.MAX_REMAIN_AMOUNT)
	-- Quỹ Till
	UNION
			(
			SELECT
            enFund.CODE AS FUND_CODE
            ,enFund.NAME AS FUND_NAME
            ,CASE
              WHEN enFund.TYPE = 1 THEN 9998
              WHEN enFund.TYPE = 2 THEN 9999
              ELSE NULL
            END AS CODE
            ,enAccountType.VALUE AS ACCOUNT_TYPE
            ,enCurrency.DISPLAY_ORDER
            ,enCurrency.CODE AS CURRENCY_CODE
            ,SUM(enRemain.TOTAL_AMOUNT) AS TOTAL_AMOUNT
            ,enThreshHold.MAX_REMAIN_AMOUNT
            ,CASE
              WHEN enThreshHold.MAX_REMAIN_AMOUNT IS NOT NULL THEN (CASE 
                                                              WHEN SUM(enRemain.TOTAL_AMOUNT) - enThreshHold.MAX_REMAIN_AMOUNT > 0 THEN SUM(enRemain.TOTAL_AMOUNT) - enThreshHold.MAX_REMAIN_AMOUNT
                                                              ELSE NULL
                                                            END)
              ELSE NULL
            END AS OVER_AMOUNT
          FROM
            RPT_MONEY_REMAIN enRemain
          INNER JOIN COM_FUND enFund
            ON enRemain.FUND_ID = enFund.FUND_ID
            AND enFund.TYPE = 3 -- Quỹ till
            AND enFund.DELETED = 0
          LEFT JOIN COM_CURRENCY enCurrency
            ON enRemain.CURRENCY_CODE = enCurrency.CODE
            AND enCurrency.DELETED = 0
          LEFT JOIN SMX_ACCOUNT_TYPE enAccountType
            ON enRemain.ACCOUNT_TYPE_ID = enAccountType.KEY
          LEFT JOIN (SELECT
                      MAX(EFFECTIVE_DATE) AS EFFECTIVE_DATE
                      ,FUND_ID
                      ,CURRENCY_ID
                    FROM 
                      RPT_FUND_THRESHOLD
                    WHERE
                      EFFECTIVE_DATE < :ReportDTG
                    GROUP BY
                      FUND_ID, CURRENCY_ID
                    ) enGroup
            ON enRemain.FUND_ID = enGroup.FUND_ID
            AND enCurrency.CURRENCY_ID = enGroup.CURRENCY_ID
          LEFT JOIN RPT_FUND_THRESHOLD enThreshHold
            ON enRemain.FUND_ID = enThreshHold.FUND_ID
            AND enCurrency.CURRENCY_ID = enThreshHold.CURRENCY_ID
            AND enGroup.EFFECTIVE_DATE = enThreshHold.EFFECTIVE_DATE
            AND enRemain.ACCOUNT_TYPE_ID = 7
            AND enThreshHold.FUND_TYPE = 3
          WHERE
            enRemain.BUSINESS_DATE = TO_NUMBER(TO_CHAR(:ReportDTG, 'YYYYMMDD'))
			AND :ExportTill = 1
            AND (',' || :FundID || ',' LIKE '%,' || enRemain.FUND_ID || ',%')
            AND (:CurrencyID IS NULL OR ',' || :CurrencyID || ',' LIKE '%,' || enCurrency.CURRENCY_ID || ',%')
            AND (:AccountType IS NULL OR ',' || :AccountType || ',' LIKE '%,' || enRemain.ACCOUNT_TYPE_ID  || ',%')
          GROUP BY
            enFund.TYPE, enFund.CODE, enFund.NAME, enAccountType.VALUE, enCurrency.DISPLAY_ORDER, enCurrency.CODE, enThreshHold.MAX_REMAIN_AMOUNT
			)
          ORDER BY
            CODE, DISPLAY_ORDER,ACCOUNT_TYPE;