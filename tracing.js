const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { SimpleSpanProcessor, TraceIdRatioBasedSampler } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { trace } = require("@opentelemetry/api");
//exporter
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
//instrumentations
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");

//Exporter
module.exports = (serviceName) => {
 const exporter = new JaegerExporter({
   endpoint: "http://localhost:14268/api/traces",
 });
 const provider = new NodeTracerProvider({
    sampler: new TraceIdRatioBasedSampler(0.5),
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
 });
 provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
 provider.register();
 registerInstrumentations({
   instrumentations: [
     getNodeAutoInstrumentations()
   ],
   tracerProvider: provider,
 });
 return trace.getTracer(serviceName);
};