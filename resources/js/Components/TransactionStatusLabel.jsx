export default function TransactionStatusLabel({ status }) {
    if (status === 1) {
        return <div className="badge badge-primary">Pending</div>;
    } else if (status === 2) {
        return <div className="badge badge-secondary">Packaging</div>;
    } else if (status === 3) {
        return <div className="badge badge-accent">Shipment</div>;
    } else if (status === 4) {
        return <div className="badge badge-success">Finished</div>;
    } else if (status === 5) {
        return <div className="badge badge-error">Cancel</div>;
    }
};
