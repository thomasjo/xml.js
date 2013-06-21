/*! Copyright (c) 2012 fluxLoop AS | https://raw.github.com/fluxloop/xml.js/master/LICENSE */

;(function () {
    'use strict';

    var root = this,
        previousXML = root.XML,
        XML = {}

    XML.VERSION = '0.1.1';

    XML.objectify = function (xml) {
        var obj;

        if (typeof xml === 'string') {
            xml = parseXML(xml);
        }

        if (xml) {
            if (xml.nodeType === root.Node.DOCUMENT_NODE) {
                return this.objectify(xml.documentElement);
            }

            xml.normalize();
            obj = {};
            obj[xml.nodeName] = toObj(xml);
        }

        return obj;
    };

    XML.stringify = function (obj) {
        var xmlString = '',
            prop;

        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                xmlString += toXMLString(obj[prop], prop);
            }
        }

        return xmlString;
    };

    XML.noConflict = function () {
        root.XML = previousXML;
        return this;
    };


    if (typeof module !== 'undefined' && typeof module !== 'function') { module.exports = XML; }
    else if (typeof define === 'function' && define.amd) { define(XML); }
    else { root.XML = XML; }


    function toObj(xmlNode) {
        var obj = {},
            attribute,
            childNode,
            childNodeName,
            i, ii;

        if (xmlNode.nodeType !== root.Node.ELEMENT_NODE) {
            throw new Error('Unsupported node type: ' + xmlNode.nodeType);
        }

        for (i = 0, ii = xmlNode.attributes.length; i < ii; i++) {
            attribute = xmlNode.attributes[i];
            obj['@' + attribute.nodeName] = attribute.nodeValue;
        }

        for (i = 0, ii = xmlNode.childNodes.length; i < ii; i++) {
            childNode = xmlNode.childNodes[i];
            childNodeName = childNode.nodeName;

            if (childNode.nodeType === 3) {
                // NOTE: Is this block reasonable and safe?
                childNodeValue = childNode.nodeValue.trim();
                if (childNodeValue !== "") {
                    obj['#text'] = childNodeValue;
                }
            }
            else if (obj[childNodeName]) {
                if (obj[childNodeName] instanceof Array) {
                    obj[childNodeName].push(toObj(childNode));
                }
                else {
                    obj[childNodeName] = [obj[childNodeName], toObj(childNode)];
                }
            }
            else {
                obj[childNodeName] = toObj(childNode);
            }
        }

        return obj;
    }

    function toXMLString(obj, name) {
        var xmlString = '',
            children = [],
            prop,
            i, ii;

        if (obj instanceof Array) {
            for (i = 0, ii = obj.length; i < ii; i++) {
                xmlString += toXMLString(obj[i], name);
            }
        }
        else if (typeof obj === 'object') {
            xmlString += '<' + name;

            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (prop.charAt(0) === '@') {
                        xmlString += ' ' + prop.substr(1) + '="' + obj[prop] + '"';
                    }
                    else {
                        children.push(prop);
                    }
                }
            }

            if (children.length) {
                xmlString += '>';

                for (i = 0, ii = children.length; i < ii; i++) {
                    prop = children[i];

                    if (prop === '#text') {
                        xmlString += obj[prop];
                    }
                    else if (prop.charAt(0) !== '@') {
                        xmlString += toXMLString(obj[prop], prop);
                    }
                }

                xmlString += '</' + name + '>';
            }
            else {
                xmlString += '/>';
            }
        }
        else {
            xmlString += '<' + name + '>' + obj + '</' + name + '>';
        }

        return xmlString;
    }

    function parseXML(xmlString) {
        var parser,
            xmlDocument;

            if (root.DOMParser) {
                try {
                    parser = new root.DOMParser();
                    xmlDocument = parser.parseFromString(xmlString , "text/xml");
                }
                catch (error) {
                    xmlDocument = undefined;
                }
            }
            else {
                throw new Error('DOMParser is required.');
            }

        if (!xmlDocument || xmlDocument.getElementsByTagName('parsererror').length) {
            throw new Error('Unable to parse XML.');
        }

        return xmlDocument;
    }

}).call(this);