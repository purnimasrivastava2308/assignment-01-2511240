-- Q1: List all customers along with the total number of orders they have placed
select customer_id, customer_name, count(DISTINCT order_id) as total_purchase 
from 'C:\Users\Purnima Srivastava\Downloads\orders_flat.csv' 
group by customer_id, customer_name;

-- Q2: Find the top 3 customers by total order value
select customer_id, customer_name, sum(quantity*unit_price) as total_order_value 
from 'C:\Users\Purnima Srivastava\Downloads\orders_flat.csv' 
group by customer_id, customer_name 
order by customer_id 
desc limit 3;

-- Q3: List all products purchased by customers from Bangalore
select distinct pp.product_id, pp.product_name 
from 'C:\Users\Purnima Srivastava\Downloads\products.parquet' pp 
join 'C:\Users\Purnima Srivastava\Downloads\orders_flat.csv' ofl 
using (order_id) 
where ofl.customer_city = 'Bangalore';

-- Q4: Join all three files to show: customer name, order date, product name, and quantity
select ofl.customer_name, ofl.order_date, pp.product_name, ofl.quantity 
from 'C:\Users\Purnima Srivastava\Downloads\products.parquet' pp 
join 'C:\Users\Purnima Srivastava\Downloads\orders_flat.csv' ofl 
using (product_id) 
join 'C:\Users\Purnima Srivastava\Downloads\customers.csv' c 
using (customer_id);
