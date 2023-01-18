import * as planck from "planck";

function renderCircle(
  context: CanvasRenderingContext2D,
  shape: planck.Circle
): void {
  context.beginPath();
  context.arc(0, 0, shape.getRadius(), 0, Math.PI * 2);
  context.stroke();
}

function renderEdge(
  context: CanvasRenderingContext2D,
  shape: planck.Edge
): void {
  context.beginPath();
  context.moveTo(shape.m_vertex1.x, shape.m_vertex1.y);
  context.lineTo(shape.m_vertex2.x, shape.m_vertex2.y);
  context.stroke();
}

function drawPolygon(
  context: CanvasRenderingContext2D,
  vertices: planck.Vec2[],
  isClosed: boolean
): void {
  if (!vertices.length) return;
  context.beginPath();
  const [first, ...rest] = vertices;
  context.moveTo(first.x, first.y);
  for (const vertex of rest) {
    context.lineTo(vertex.x, vertex.y);
  }
  if (isClosed) {
    context.closePath();
  }
  context.stroke();
}

function renderPolygon(
  context: CanvasRenderingContext2D,
  shape: planck.Polygon
): void {
  drawPolygon(context, shape.m_vertices, true);
}

function renderChain(
  context: CanvasRenderingContext2D,
  shape: planck.Chain
): void {
  drawPolygon(context, shape.m_vertices, false);
}

function renderShape(
  context: CanvasRenderingContext2D,
  shape: planck.Shape
): void {
  switch (shape.getType()) {
    case "circle":
      return renderCircle(context, shape as planck.Circle);
    case "edge":
      return renderEdge(context, shape as planck.Edge);
    case "polygon":
      return renderPolygon(context, shape as planck.Polygon);
    case "chain":
      return renderChain(context, shape as planck.Chain);
  }
}

function renderBody(
  context: CanvasRenderingContext2D,
  body: planck.Body
): void {
  context.save();
  try {
    context.translate(body.getPosition().x, body.getPosition().y);
    context.rotate(body.getAngle());
    for (
      let fixture = body.getFixtureList();
      fixture;
      fixture = fixture.getNext()
    ) {
      renderShape(context, fixture.getShape());
    }
  } finally {
    context.restore();
  }
}

export function render(
  context: CanvasRenderingContext2D,
  world: planck.World
): void {
  for (let body = world.getBodyList(); body; body = body.getNext()) {
    renderBody(context, body);
  }
}
