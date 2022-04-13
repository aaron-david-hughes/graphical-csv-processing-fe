Graphical CSV Processing FE
===========================
Enables creation of graphical queries on CSV data.  
* The graph nodes are limited for number of inputs, however number of outputs is unlimited.  
* There may not be any cycles created in the graphical query as it creates codependency which
cannot be determined come processing.
* Issues will be indicated when appropriate.
* Users may change configuration of default values through settings.
* Larger changes to configuration can be achieved by mounting a user's volume on container run.

---

Docker Quick Start
------------------
### _Docker Registry_
[Docker Hub](https://hub.docker.com/r/qub40232046/40232046-graphical-processing-fe): qub40232046/40232046-graphical-processing-fe

### _Quick Start_
```shell
docker run -d -p 3000:3000 qub40232046/40232046-graphical-processing-fe:{tag}
```
This will use the default configuration, which is intended for use with the paired [backend](https://hub.docker.com/r/qub40232046/40232046-graphical-processing-be).  
The default URL is localhost:8080 for the backend.

### _Custom Backend URL_
```shell
docker run -d -p 3000:3000 -e REACT_APP_BACKEND="{url}" qub40232046/40232046-graphical-processing-fe:{tag}
```
Note:REACT_APP_BACKEND variable only needs to be supplied to override backend specified in config file.

### _Supplying Configuration File_
```shell
docker run -d -p 3000:3000 --volume={config path}/config.json:/app/src/config.json qub40232046/40232046-graphical-processing-fe:{tag}
```
Refer to [Configuration section](#user-content-configuration) for more details on how to create custom configurations.

---

Configuration
-------------
Default Configuration can be found [here](src/config.json).
* [Non-configurable Nodes](#user-content-non-configurable-nodes)
* [Default Operation Nodes](#user-content-default-operation-nodes)
* [Operation Form Configuration Options](#user-content-form-configuration-options)

### _Non-configurable Nodes_
Two node options are hard coded into the frontend due to their core importance to the implementation.  
* Open File: how data is input to the query.
* Write File: how data is returned from the query (non write file nodes will also be returned if not used as input for another node).

### _Default Operation Nodes_
There are a list of default nodes broken down to a reasonable extent for purpose of integration with the backend referenced at the top.
* Join Left
* Join Right
* Join Inner
* Join Outer
* Filter String Equality
* Filter Numeric Equality
* Filter Greater Than
* Filter Greater Than or Equal
* Filter Less Than
* Filter Less Than or Equal
* Drop Column(s)
* Take Column(s)
* Alias
* Rename Column
* Merge Columns String Equality
* Merge Columns Numeric Equality
* Merge Rows
* Limit
* Concat Tables
* Unique Column
* Or
* Order Alphabetical Ascending
* Order Alphabetical Descending
* Order Numerically Ascending
* Order Numerically Descending
* Drop Alias
* Set Complement
* Concat Columns
* Literal Add
* Literal Subtract
* Literal Multiply
* Literal Divide
* Literal Modulo
* Variable Add
* Variable Subtract
* Variable Multiply
* Variable Divide
* Variable Modulo
* Row Average
* Row Count
* Row Max
* Row Min
* Row Sum 
* Column Average
* Column Count
* Column Max
* Column Min
* Column Sum

### _Form Configuration Options_
An example operation configuration might be as follows:
```json
{
    "operation": "testOp",
    "name": "Test Operation",
    "template": {
        "operation": "backendOperationName",
        "specificOperation": "testOp",
        "textFieldName": null,
        "numericFieldName": null,
        "integerFieldName": null,
        "dropdownFieldName": "first",
        "switchFieldName": true,
        "nonUserEditableField": "unchangeable value",
        "expectedInputs": 2
    },
    "textFieldName": {
        "input": "text",
        "title": "Text Field Name",
        "width": "100%",
        "required": true
    },
    "numericFieldName": {
        "input": "numeric",
        "title": "Numeric Field Name",
        "width": "100%",
        "required": true
    },
    "integerFieldName": {
        "input": "integer",
        "title": "Integer Field Name",
        "width": "100%",
        "required": true
    },
    "dropdownFieldName": {
        "input" : "dropdown",
        "title": "Dropdown Field Name",
        "width": "100%",
        "required": true,
        "options": [
            "first",
            "second",
            "third"
        ]
    },
    "switchFieldName": {
        "input": "switch",
        "title": "Switch Field Name",
        "width": "100%",
        "required": true
    }
}
```
Visible in the example are each of the possible options regarding a field.
* [Uneditable Field](#user-content-uneditable-field)
* [Text Field](#user-content-text-field)
* [Numeric Field](#user-content-numeric-field)
* [Integer Field](#user-content-integer-field)
* [Dropdown Field](#user-content-dropdown-field)
* [Switch Field](#user-content-switch-field)

#### _Uneditable Field_
As seen above, a field which is intended for user input will be configured by an object value under its name as key.  
If no key is present for configuration by the user, it is assumed the value it is given in the template is what is to be sent to the backend.  

An example of this is "nonUserEditableField".

#### _Text Field_
Text fields offer the following configurability:
* title: this is what will show above the input
* width: how much of the current form line to give this input (flex-wrap).
* required: if required, the field will indicate it requires an input and prevent form submission.
* errorText: specified inline error message, defaults to "Please fill in this field.".

An example of this is "textFieldName".  
Validation of text fields is non-empty string presence and is carried out onBlur of the input.

#### _Numeric Field_
Numeric fields offer the following configurability:
* title: this is what will show above the input
* width: how much of the current form line to give this input (flex-wrap).
* required: if required, the field will indicate it requires an input and prevent form submission.
* errorText: specified inline error message, defaults to "Please supply a number.".

An example of this is "numericFieldName".  
Validation of numeric fields is number presence and is carried out onBlur of the input.

#### _Integer Field_
Integer fields offer the following configurability:
* title: this is what will show above the input
* width: how much of the current form line to give this input (flex-wrap).
* required: if required, the field will indicate it requires an input and prevent form submission.
* errorText: specified inline error message, defaults to "Please supply an integer.".

An example of this is "integerFieldName".  
Validation of integer fields is integer presence and is carried out onBlur of the input.

#### _Dropdown Field_
Dropdown fields offer the following configurability:
* title: this is what will show above the input
* width: how much of the current form line to give this input (flex-wrap).
* required: if required, the field will indicate it requires an input and prevent form submission.
* options: an array of options.

An example of this is "dropdownFieldName".  
Validation is unnecessary on this field.

#### _Switch Field_
Switch fields offer the following configurability:
* title: this is what will show above the input
* width: how much of the current form line to give this input (flex-wrap).
* required: if required, the field will indicate it requires an input and prevent form submission.

An example of this is "switchFieldName".  
Validation is unnecessary on this field.

---

Save and Load Queries
---------------------
There are 3 levels of queries which you can save, and load back in for future use.  
* [Save Config](#user-content-save-config)
* [Save Config Template](#user-content-save-config-template)
* [Save Template](#user-content-save-template)

### _Save Config_
This will save a valid graph in its entirety, files and all. Useful for repetition of exact query at a later stage.
Loading this graph in will produce a processable query immediately.

### _Save Config Template_
This will save a valid graph for all but its input files. Useful for queries which need to run periodically with
simply input data changing.  
Loading this graph will mean Open File nodes are invalid, as they need files supplied. Once they are, the graph will
be processable.

### _Save Template_
This will only save the node operations, and the flow of data indicated by edges.  
The configuration of the nodes and supplying of the data files will need to be carried out after loading the graph.

---

