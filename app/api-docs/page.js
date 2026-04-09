'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Swagger UI needs to run on the client as it requires the window object
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '20px' }}>
      <SwaggerUI url="/swagger.yaml" />
    </div>
  );
}
