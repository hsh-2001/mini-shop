DROP FUNCTION IF EXISTS get_overview(p_shop_id INT);

CREATE FUNCTION get_overview(p_shop_id INT)
RETURNS TABLE (
    total_sales DECIMAL(10, 2),
    total_orders INT,
    total_products INT,
    past_7_days_sales JSONB
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(o.final_amount), 0)::DECIMAL(10, 2) AS total_sales,
        COUNT(DISTINCT o.id)::INT AS total_orders,
        (
            SELECT COUNT(*) 
            FROM products 
            WHERE shop_id = p_shop_id
        )::INT AS total_products,

        (
            SELECT JSONB_AGG(
                JSONB_BUILD_OBJECT(
                    'date', d.day,
                    'sales', COALESCE(s.sales, 0)
                )
                ORDER BY d.day
            )
            FROM (
                SELECT generate_series(
                    CURRENT_DATE - INTERVAL '6 days',
                    CURRENT_DATE,
                    INTERVAL '1 day'
                )::date AS day
            ) d
            LEFT JOIN (
                SELECT 
                    date_trunc('day', o2.created_on)::date AS day,
                    SUM(o2.final_amount) AS sales
                FROM orders o2
                WHERE o2.shop_id = p_shop_id
                    AND o2.status NOT IN ('CANCELLED', 'PENDING')
                GROUP BY 1
            ) s ON s.day = d.day
        )::JSONB AS past_7_days_sales

    FROM orders o
    WHERE o.shop_id = p_shop_id
        AND o.status NOT IN ('CANCELLED', 'PENDING');
END;
$$ LANGUAGE plpgsql;