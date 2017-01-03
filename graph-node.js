var GraphNode = function(name) {
  this.src = [];
  this.name = name;
  this.id = name;
  // this.column = 0;
  this.tar = [];
};

//adds a source to the array of sources of particular node
GraphNode.prototype.addSource = function (hit) {
  this.src.push(hit);
};

//returns array of all sources of particular node
GraphNode.prototype.getSource = function () {
  return this.src;
};

//adds a target to the array of targets of particular node
GraphNode.prototype.addTarget = function (hit) {
  this.tar.push(hit);
};

//returns array of all targets of particular node
GraphNode.prototype.getTarget = function () {
  return this.tar;
};

//checks whether array of objects contains a node of name 'name'
Array.prototype.contains = function (name) {
   for (i in this) {
       if (this[i]['name'] == name) return i;
   }
   return -1;
}

d3.csv('tester.csv', function(error, data) {
  console.log(data);
  var json = {
    nodes: [],
    links: []
  };
  var objKeys = Object.keys(data[0]);
  data.forEach(function(d) {
    var index = 0;
    for (var i in d) {
      //check if json.nodes contains the current node of noame d[objKeys[index]]
      //if yes, var node = json.nodes at that index, add respective srcs and tars
      var inOrOut = json.nodes.contains(d[objKeys[index]]);
      var node;
      if ( inOrOut != -1) {
        node = json.nodes[inOrOut];
        if (index != 0) {
          node.addSource(d[objKeys[index - 1]]);
        }
        if (index != objKeys.length - 1) {
          node.addTarget(d[objKeys[index + 1]]);
        }
        index++;
      } else {
        //if no, create a new node of name d[objkeys[index]] with respectice srcs and tars
        node = new GraphNode(d[objKeys[index]]);
        if (index != 0) {
          node.addSource(d[objKeys[index - 1]]);
        }
        if (index != objKeys.length - 1) {
          node.addTarget(d[objKeys[index + 1]]);
        }
        index++;
        json.nodes.push(node);
      }
    }
  });

  json.nodes.forEach(function(d) {
    console.log(d);
    var curr = "";
    var linky = {source: parseInt(json.nodes.contains(d.name)), target: 0, value: 1};
    for (var i = 0; i < d.tar.length; i++) {
      var next = d.tar[i];
      if (curr != next) {
        json.links.push(linky);
        curr = next;
        linky.target = parseInt(json.nodes.contains(next));
      } else {
        linky.value++;
      }
    }
  });
  console.log(json);

  // var chart = d3.select("#chart").append("svg").chart("Sankey.Path");
  // chart
  //   .name(label)
  //   .colorNodes(function(name, node) {
  //     return color(node, 1) || colors.fallback;
  //   })
  //   .colorLinks(function(link) {
  //     return color(link.source, 4) || color(link.target, 1) || colors.fallback;
  //   })
  //   .nodeWidth(15)
  //   .nodePadding(10)
  //   .spread(true)
  //   .iterations(0)
  //   .draw(json);
  // function label(node) {
  //   return node.name.replace(/\s*\(.*?\)$/, '');
  // }
  // function color(node, depth) {
  //   var id = node.id.replace(/(_score)?(_\d+)?$/, '');
  //   if (colors[id]) {
  //     return colors[id];
  //   } else if (depth > 0 && node.targetLinks && node.targetLinks.length == 1) {
  //     return color(node.targetLinks[0].source, depth-1);
  //   } else {
  //     return null;
  //   }
  // }
});
