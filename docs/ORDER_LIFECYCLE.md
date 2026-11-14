# Order lifecycle

## Parts order
submitted → awaiting_supplier_quote → quote_ready → awaiting_customer_approval → approved → sourcing → ready_for_delivery → delivered → completed

Alternative terminal states: rejected, cancelled, quote_expired.

A quote stores line-item snapshots, supplier/source references, quote time, expiry, delivery cost, installation cost (if requested), total and administrator identity. Approval references the exact quote version. A changed quote requires renewed customer approval.

## Service job
Track independently: requested, confirmed, assigned, on_the_way, in_progress, awaiting_customer_approval, completed, cancelled.

## Payment
Track independently: unpaid, partially_collected, collected, refunded. Record each collection as an auditable event.
