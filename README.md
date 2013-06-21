xml.js
======
xml.js is a minimalistic library for working with XML in JavaScript; it supports converting to and from XML,
in a simple, straight forward manner.

Example usage
-------------
Converting an XML document, in this case, in the form of a string, to a JavaScript object

```js
var obj = XML.objectify(
    "<stock-quote market=\"NYSE\">" +
    "  <symbol>IBM</symbol>" +
    "  <price type=\"ask\" value=\"84.25\"/>" +
    "  <price type=\"bid\" value=\"85.00\"/>" +
    "  <when>" +
    "    <date>8/5/2005</date>" +
    "    <time>12:13PM</time>" +
    "  </when>" +
    "</stock-quote>"
    );

/*
obj = {
    "stock-quote": {
        "@market": "NASDAQ",
        symbol: {
            "#text": "AAPL"
        },
        price: [
            { "@type": "ask", "@value": "412.76" },
            { "@type": "bid", "@value": "413.5" } 
        ],
        when: {
            date: { "#text": "2013-06-21" },
            time: { "#text": "22:09" }
        }
    }
}
*/
```

Likewise, we can convert from a JavaScript object to XML

```js
var xml = XML.stringify({
    "stock-quote": {
        "@market": "NASDAQ",
        symbol: {
            "#text": "AAPL"
        },
        price: [
            { "@type": "ask", "@value": "412.76" },
            { "@type": "bid", "@value": "413.5" } 
        ],
        when: {
            date: { "#text": "2013-06-21" },
            time: { "#text": "22:09" }
        }
    }
});

// xml = '<stock-quote market="NASDAQ"><symbol>AAPL</symbol><price type="ask" value="412.76"/><price type="bid" value="413.5"/><when><date>2013-06-21</date><time>22:09</time></when></stock-quote>'
```
