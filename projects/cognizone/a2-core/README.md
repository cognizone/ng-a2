# @cognizone/a2-core

Core Angular library providing RDF data models, typed resources, REST services, and Elasticsearch utilities for Cognizone applications.
Requires:
**Angular >= 20 for v1.1.0**
**Angular >= 21 for v2.0.0**

## Installation

```bash
npm i @cognizone/a2-core
```

## Key Features

- **Application Profile**: Profile, Type, and Attribute management with merging and filtering utilities
- **Attribute Model**: JSON data model with attribute-value operations, deep copy, and nested object navigation
- **RDF Support**: RDF data type definitions with URI-based types, namespace management (RDF, RDFS, XSD), and shortened notation
- **TypedResource/JSON**: JSON to typed resource conversion, resource wrapping, and relationship management
- **Utilities**: String validation and precondition checks
- **Elasticsearch**: Result parsing, filtering (range, term, text), aggregations, and facet search
- **REST Call Service**: HTTP request service with fluent builder API
