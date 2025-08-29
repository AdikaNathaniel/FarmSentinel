
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const db = getFirestore();

/**
 * Firestore trigger that runs whenever a new alert is created.
 * It creates a corresponding log entry.
 */
export const onAlertCreated = onDocumentCreated("farms/{farmId}/alerts/{alertId}", (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }
    const data = snapshot.data();
    const { farmId } = event.params;
    
    console.log(`New alert created for farm ${farmId}, logging event.`);

    return db.collection(`farms/${farmId}/logs`).add({
        nodeId: data.nodeId,
        eventType: 'alert',
        details: `Severity ${data.severity} alert triggered.`,
        timestamp: FieldValue.serverTimestamp(),
    });
});
